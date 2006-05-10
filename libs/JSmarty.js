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

	_ajax: new JSmarty.Core.Ajax(),
	_result:'',
	_pattern: new RegExp(),
	_tpl_vars:{},
	_isblock:{},
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
 # public methods : Parser
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
JSmarty.prototype.variables = function(string, array, prefix)
{
	var result;
	var L = this.left_delimiter;
	var R = this.right_delimiter;
	var pattern = this._pattern;

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

/** _filter **/
JSmarty.prototype._filter = function(type, src)
{
	var filter;
	return '';
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

	if(typeof plugin[func] == 'undefined')
		plugin[func] = JSAN.require('JSmarty.'+ type +'.'+ func);
	if(!plugin[func]) return '';

	if(func != 'If') param = this.toParams(result[2]);

	content = (!content) ? plugin[func](param, this):
	                       plugin[func](param, content, this);

	return content;
}

/** parser **/
JSmarty.prototype.parser = function(src, initial)
{
	var isblock = this._isblock, pattern = this._pattern;
	var L = this.left_delimiter, R = this.right_delimiter;
	var result, count = 0, flag = false, block = [], point = 0;

	if(initial)
	{
		pattern.compile(L+'\\/(.*?)'+R,'g');
		while(result = pattern.exec(src)) isblock[result[1]] = true;
	}

	pattern.compile(L+'([\\w/]+)([^'+L+']*?)'+R, 'g');

	if(initial)
	{
		src = src.replace(pattern, L+R+L+'$1$2'+R+L+R);
	}

	src = src.split(L+R);

	for(var i=0;i<src.length;i++)
	{
		if((result = pattern.exec(src[i])) == null) continue;

		if(src[i] == (L+'/'+block[1]+R))
		{
			if(count > 0) count--;
			else
				src.splice(point, i, this._function('Block', block, src.splice(point+1, i-2).join(L+R)));
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

	return this.variables(src.join(''));
}
/* --------------------------------------------------------------------
 # public methods : Template Variables
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
	return (tpl_var) ? this._tpl_vars[tpl_var] : this._tpl_vars;
}
/* --------------------------------------------------------------------
 # public methods : Template Process
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
	if(this.debugging) e =(new Date()).getTime(), alert('HTML Convert Time :\t'+ (e-s)/1000 +'.sec');

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
 # public methods : Plugins
 -------------------------------------------------------------------- */
/** register_block **/
JSmarty.prototype.register_block = function(name, impl){
	this._plugins.Block[name] = impl;
}
/** register_function **/
JSmarty.prototype.register_function = function(name, impl){
	this._plugins.Function[name] = impl;
}
/** register_modifier **/
JSmarty.prototype.register_modifier = function(name, impl){
	this._plugins.Modifier[name] = impl;
}
/** register_compiler_function **/
JSmarty.prototype.register_compiler_function = function(name, impl){
	this._plugins.Compiler[name] = impl;
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