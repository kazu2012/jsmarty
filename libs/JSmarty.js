////////////////////////////////////////////////////////////////////////
JSmarty = function(){};
JSmarty.Block = {};
JSmarty.Shared = {};
JSmarty.Insert = {};
JSmarty.Modifier = {};
JSmarty.Compiler = {};
JSmarty.Resource = {};
JSmarty.Function = {};
JSmarty.Prefilter = {};
JSmarty.Postfilter = {};
JSmarty.Outputfilter = {};
/////////////////////////////////////////////////////////**NAME SPACES**
JSAN.use('JSmarty.Parser');
JSAN.use('JSmarty.Shared.Ajax');
/////////////////////////////////////////////////
///////////**INCLUDES**
JSmarty.AUTHOR	= 'shogo';
JSmarty.VERSION = 'dev0.0.1';
JSmarty.LICENSE = 'LGPL';

JSmarty.prototype = new JSmarty.Parser();
JSmarty.prototype.debugging = false;
JSmarty.prototype.template_dir = './templates/';
JSmarty.prototype.autoload_fils = '';
JSmarty.prototype.left_delimiter = '{',
JSmarty.prototype.right_delimiter = '}',
JSmarty.prototype._xmlhttp = new JSmarty.Shared.Ajax();

/* --------------------------------------------------------------------
 # Template Variables
 -------------------------------------------------------------------- */
/** assign **/
JSmarty.prototype.assign = function(key, value)
{
	switch(typeof value)
	{
		case 'undefined':
			value = null;
			break;
	}

	if(typeof key == 'string')
	{
		this._tpl_vars['$'+key] = value;
		return;
	}

	for(var i in key)
	{
		if(i == '') continue;
		this._tpl_vars[i] = key[i];
	}
}
/** clear_assign **/
JSmarty.prototype.clear_assign = function(key)
{
	if(typeof key == 'string')
	{
		delete this._tpl_vars[key];
		return;
	}

	for(var i in key)
	{
		if(i == '') continue;
		delete this._tpl_vars[key[i]];
	}
}
/** clear_all_assign **/
JSmarty.prototype.clear_all_assign = function(){
	this._tpl_vars = {};
}
/** get_template_vars **/
JSmarty.prototype.get_template_vars = function(key){
	return (key) ? this._tpl_vars[key] : this._tpl_vars;
}
/* --------------------------------------------------------------------
 # Template Process
 -------------------------------------------------------------------- */
/** fetch **/
JSmarty.prototype.fetch = function(file, element, display)
{
	var eot, sot, res, xmlhttp = this._xmlhttp;

	if(element)
	{
		xmlhttp.display(this.template_dir + file, element, this);
		return;
	}

	res = xmlhttp.file_get_contents(this.template_dir + file);
	if(this.debugging) sot =(new Date()).getTime();
	res = this.parser(res);
	if(this.debugging)
	{
		eot =(new Date()).getTime();
		alert('HTML Convert Time :\t'+ (eot-sot)/1000 +'.sec');
	}

	if(display) document.write(res);

	return res;
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
/** register_block **/
JSmarty.prototype.register_block = function(name, impl){
	this._plugins.Block[name] = impl;
}
/** register_function **/
JSmarty.prototype.register_function = function(name, impl){
	this._plugins.Function[name] = impl;
}
/** register_mod **/
JSmarty.prototype.register_mod = function(name, impl){
	this._plguins.Modifier[name] = impl;
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
/** unregister_mod **/
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
/** load_fil**/
JSmarty.prototype.load_filter = function(type, name){
}
/** register_prefilter **/
JSmarty.prototype.register_prefilter = function(name){
	this._plugins.Prefilter[name] = eval(name);
}
/** register_postfilter **/
JSmarty.prototype.register_postfilter = function(name){
	this._plugins.Postfilter[name] = eval(name);
}
/** register_outputfilter **/
JSmarty.prototype.register_outputfilter = function(name){
	this._plugins.Outputfilter[name] = false;
}
/** unregister_prefilter **/
JSmarty.prototype.unregister_prefilter = function(name){
	this._plugins.Prefilter[name] = false;
}
/** unregister_postfilter **/
JSmarty.prototype.unregister_postfilter = function(name){
	this._plugins.Postfilter[name] = false;
}
/** unregister_outputfilter **/
JSmarty.prototype.unregister_outputfilter = function(name){
	this._plugins.Outputfilter[name] = false;
}