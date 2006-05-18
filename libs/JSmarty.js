////////////////////////////////////////////////////////////////////////
JSmarty = function(){};
JSmarty.Core = {};
JSmarty.Block = {};
JSmarty.Insert = {};
JSmarty.Modifier = {};
JSmarty.Compiler = {};
JSmarty.Resource = {};
JSmarty.Function = {};
JSmarty.Prefilter = {};
JSmarty.Postfilter = {};
JSmarty.Outputfilter = {};
/////////////////////////////////////////////////////////**NAME SPACES**
JSAN.use('JSmarty.Core.Ajax');
////////////////////////////////////////////////////////////**INCLUDES**
JSmarty.AUTHOR	= 'shogo';
JSmarty.VERSION = 'dev0.0.1';
JSmarty.LICENSE = 'LGPL';

JSmarty.prototype =
{
	debugging : false,
	template_dir : './templates/',
	left_delimiter : '{',
	right_delimiter : '}',
	autoload_filters: {},
	_ajax: new JSmarty.Core.Ajax(),
	_result:'',
	_pattern: new RegExp(),
	_isblock:{},
	_tpl_vars:{},
	_plugins:
	{
		Modifier: {}, Function:  {}, Block:       {},
		Prefilter:{}, Postfilter:{}, Outputfilter:{},
		Resource: {}, Insert:    {}, Compiler:    {}
	},
	$smarty:
	{
		get:{},
		foreach: {}, sections:{}, capture:{},
		ldelim : this.left_delimiter, rdelim: this.right_delimiter,
		version: JSmarty.VERSION, template: ''
	}
}
/* --------------------------------------------------------------------
 # Parser
 -------------------------------------------------------------------- */
// toParams
JSmarty.prototype.toParams = function(string)
{
	var result;
	var params	= new Array();
	var pattern = new RegExp();

	pattern.compile('(\\w+)=(\'|\"|)([^\\s]+|[^\\2]+?)\\2','g');
	while((result = pattern.exec(string)) != null){
		params[result[1]] = result[3];
	}

	return params;
}
JSmarty.prototype._variable = function(string, array, prefix)
{
	var result, pattern = this._pattern;
	var L = this.left_delimiter, R = this.right_delimiter;

	if(!array)	array  = this._tpl_vars;
	if(!prefix) prefix = '';

	switch(prefix)
	{
		case '$smarty\\.':
			array = this.$smarty;
			break;
	}

	prefix = prefix.replace(/^\$/,'\\$');
	pattern.compile(L+prefix+'([\\w\.$]+)'+R,'');
	while((result = pattern.exec(string)) != null)
	{
		if(result[1].split('.').length > 1)
		{
			string = this.variables
					(
						string,
						array[result[1].split('.')[0]],
						result[1].split('.')[0]+'\\.'
					);
			continue;
		}
		string = string.replace(result[0], array[result[1]]);
	}

	return string;
}

JSmarty.prototype._var = function(result)
{
	var tpl_var;
	tpl_var = 'this.tpl_vars.' + result[0];

	return eval(tpl_var);
}

/** _filter **/
JSmarty.prototype._filter = function(type, src)
{
	var filter;
	return src;
}
/** _modifier **/
JSmarty.prototype._modifier = function()
{
	var modifier;
}
/** _function **/
JSmarty.prototype._function = function(type, result, content)
{
	var plugin, func, param;

	plugin = this._plugins[type];
	func   = result[1].charAt(0).toUpperCase() + result[1].substring(1);
	param  = (func == 'If') ? result[2] : this.toParams(result[2]);

	if(typeof plugin[func] == 'undefined')
		plugin[func] = JSAN.require('JSmarty.'+ type +'.'+ func);
	if(!plugin[func]) return '';

	content = (!content) ? plugin[func](param, this):
	                       plugin[func](param, content, this);

	return content;
}
/** parser **/
JSmarty.prototype.parser = function(src)
{
	var L = this.left_delimiter, R = this.right_delimiter;
	var result, count = 0, flag = false, block = [], point = 0;
	var regexp, isblock = this._isblock, pattern = this._pattern;

	pattern.compile(L+'([\\w/]+)([^'+L+']*?)'+R, 'g');

	if(typeof src == 'object') src = src.join(L+R).split(L+R);
	else
	{
		regexp = new RegExp(L+'\\/(.*?)'+R,'g');
		while(result = regexp.exec(src)) isblock[result[1]] = true;
		src = this._filter('Prefilter', src);
		src = src.replace(pattern, L+R+L+'$1$2'+R+L+R).split(L+R);
	}

	for(var i=0;i<src.length;i++)
	{
		if((result = pattern.exec(src[i])) == null) continue;

		if(src[i] == (L+'/'+block[1]+R))
		{
			if(count > 0) count--;
			else
				src.splice(point, i, this._function('Block', block, src.splice(point+1, i-2)));
			continue;
		}

		if(isblock[result[1]])
		{
			if(flag) count--;
			else     point = i, flag = true, block = result.toString().split(',');
			continue;
		}

		if(!flag) src[i] = this._function('Function', result);
	}

	return this._variable(src.join(''));
}
/* --------------------------------------------------------------------
 # Template Variables
 -------------------------------------------------------------------- */
/** assign **/
JSmarty.prototype.assign = function(tpl_var, value)
{
	if(typeof value == 'undefined') value = null;

	if(typeof tpl_var == 'string')
	{
		this._tpl_vars['$'+tpl_var] = value;
		return;
	}

	for(var i in tpl_var)
	{
		if(i == '') continue;
		this._tpl_vars[i] = tpl_var[i];
	}
}
/** clear_assign **/
JSmarty.prototype.clear_assign = function(tpl_var)
{
	if(typeof tpl_var == 'string')
	{
		delete this._tpl_vars['$'+tpl_var];
		return;
	}

	for(var i in tpl_var)
	{
		if(i == '') continue;
		delete this._tpl_vars['$'+tpl_var[i]];
	}
}
/** clear_all_assign **/
JSmarty.prototype.clear_all_assign = function(){
	this._tpl_vars = new Array();
}
/** get_template_vars **/
JSmarty.prototype.get_template_vars = function(tpl_var){
	return (tpl_var) ? this._tpl_vars['$'+tpl_var] : this._tpl_vars;
}
/* --------------------------------------------------------------------
 # Template Process
 -------------------------------------------------------------------- */
/** fetch **/
JSmarty.prototype.fetch = function(file, element, display)
{
	var e,s;
	var result, xmlhttp = this._ajax;

	this.$smarty.template = file;

	if(element)
	{
		xmlhttp.display(this.template_dir + file, element, this);
		return;
	}

	result = xmlhttp.file_get_contents(this.template_dir + file);
	if(this.debugging) s =(new Date()).getTime();
	result = this.parser(result, true);
	if(this.debugging)
	{
		e =(new Date()).getTime();
		alert('HTML Convert Time :\t'+ (e-s)/1000 +'.sec');
	}

	if(display === true)
	{
		document.write(result);
		return;
	}

	return result;
}
/** display **/
JSmarty.prototype.display = function(file, element){
	this.fetch(file, element, true);
}
/** templete_exists **/
JSmarty.prototype.template_exists = function(){
}
/* --------------------------------------------------------------------
 # Plugins
 -------------------------------------------------------------------- */
/** _register **/
JSmarty.prototype._register = function(name, impl, type)
{
	name = name.charAt(0).toUpperCase() + name.substring(1);
	this._plugins[type][name] = impl;
}
/** register_block **/
JSmarty.prototype.register_block = function(name, impl){
	this._register(name, impl, 'Block');
}
/** register_function **/
JSmarty.prototype.register_function = function(name, impl){
	this._register(name, impl, 'Functions');
}
/** register_modifier **/
JSmarty.prototype.register_modifier = function(name, impl){
	this._register(name, impl, 'Modifier');
}
/** register_compiler_function **/
JSmarty.prototype.register_compiler_function = function(name, impl){
	this._register(name, impl, 'Compiler');
}
/** unregister_block **/
JSmarty.prototype.unregister_block = function(name){
	this._plugins.Block[name] = false;
}
/** unregister_function **/
JSmarty.prototype.unregister_function = function(name){
	this._plugins.Function[name] = false;
}
/** unregister_modifier **/
JSmarty.prototype.unregister_modifier = function(name){
	this._plugins.Modifier[name] = false;
}
/** unregister_compiler_function **/
JSmarty.prototype.unregister_compiler_function = function(name){
	this._plugins.Compiler[name] = false;
}
/* ---------------------------------------------------------------------
 # Filter
 -------------------------------------------------------------------- */
/** load_filter**/
JSmarty.prototype.load_filter = function(){
}
/** register_prefilter **/
JSmarty.prototype.register_prefilter = function(func){
}
/** register_postfilter **/
JSmarty.prototype.register_postfilter = function(func){
}
/** register_outputfilter **/
JSmarty.prototype.register_outputfilter = function(func){
}
/** unregister_prefilter **/
JSmarty.prototype.unregister_prefilter = function(func){
}
/** unregister_postfilter **/
JSmarty.prototype.unregister_postfilter = function(func){
}
/** unregister_outputfilter **/
JSmarty.prototype.unregister_outputfilter = function(func){
}