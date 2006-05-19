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
	},
	_isBlocks: null,
	_blockElements: null,
	_pattern: new RegExp('(\\w+)=(\'|\"|)([^\\s]+|[^\\2]+?)\\2','g')
}
/* --------------------------------------------------------------------
 # Parser
 -------------------------------------------------------------------- */
// toParams
JSmarty.prototype.toParams = function(param)
{
	var result, params = [], pattern = this._pattern;

	while((result = pattern.exec(param)) != null){
		params[result[1]] = result[3];
	}

	return params;
}
/** _var **/
JSmarty.prototype._var = function(src, array)
{
	if(!array) array = this._tpl_vars;

	if(typeof src == 'string')
	{
		if(src.split('.').length > 1)
			return this._var(src, array[src.split('.')[0]]);
		return array[src];
	}

	if(src[0].split('.').length > 1)
		return this._var(src, array[src[0].split('.')[0]]);

	return array[src[0]];
}
/** _attr **/
JSmarty.prototype._attr = function(src)
{
	var attr = new Array(3);
	var S = src.indexOf(' '), D = src.indexOf('|');

	if(D>=0) attr[2] = src.slice(D), src = src.slice(0, D);
	if(S>=0) attr[1] = src.slice(S), src = src.slice(0, S);

	attr[0] = src;

	return attr;
}
/** _filter **/
JSmarty.prototype._filter = function(src, type)
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
JSmarty.prototype._function = function(result, src, type)
{
	var plugin, func, param;

	plugin = this._plugins[type];
	param  = (func == 'If') ? result[1] : this.toParams(result[1]);
	func   = result[0].charAt(0).toUpperCase() + result[0].substring(1);

	if(typeof plugin[func] == 'undefined')
		plugin[func] = JSAN.require('JSmarty.'+ type +'.'+ func);
	if(!plugin[func]) return '';

	return (src) ? plugin[func](param, src, this):
	               plugin[func](param, this);
}
/** parser **/
JSmarty.prototype.parser = function(src)
{
	var result, S, E = -1, P = 0;
	var regexp, isBlocks = this._isBlocks;
	var count = 0, flag = false, point = 0, content = '';
	var L = this.left_delimiter, R = this.right_delimiter;
 
	if(!isBlocks)
	{
		isBlocks = {};
		src = this._filter(src, 'Prefilter');
		regexp = new RegExp(L+'\\/(.+?)'+R,'g');
		while(result = regexp.exec(src)) isBlocks[result[1]] = true;
	}

	while(E != src.lastIndexOf(R))
	{
		S = src.indexOf(L, P), E = src.indexOf(R, P);

		if(flag)
		{
			P = E + R.length;

			switch(this._attr(src.slice(S + L.length, E))[0])
			{
				case result[0]:
					count++;
					break;
				case '/'+result[0]:
					if(count>0) count--;
					else
					{
						flag = false;
						content += this._function(result, src.slice(point, S), 'Block');
					}
					break;
			}
			continue;
		}

		content += src.slice(P, S);
		result = this._attr(src.slice(S + L.length, E));

		switch(result[0].charAt(0))
		{
			case '#':
				break;
			case '$':
				content += this._var(result);
				break;
			default:
				if(isBlocks[result[0]]) flag = true, point = E + R.length;
				else content += this._function(result, null, 'Function');
				break;
		}

		P = E + R.length;
	}
	content += src.slice(E + R.length);
	return (regexp) ? this._filter(content, 'Postfilter') : content;
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