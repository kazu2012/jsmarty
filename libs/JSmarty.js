if(typeof JSmarty_Parser == 'undefined') JSAN.use("JSmarty_Parser");

JSmarty = function(){};

JSmarty.AUTHORS = ['shogo'];
JSmarty.VERSION = '0.0.1M1';
JSmarty.LICENSE = 'LGPL';
JSmarty.template = {};

JSmarty.prototype = new JSmarty_Parser;
JSmarty.prototype.debugging = false;
JSmarty.prototype.plugins_dir = './plugins';
JSmarty.prototype.template_dir = './templates/';
JSmarty.prototype.default_resource_type = 'file';
JSmarty.prototype.default_template_handler_func = function(){};

/* --------------------------------------------------------------------
 # Template Variables
 -------------------------------------------------------------------- */
/** append **/
JSmarty.prototype.append = function(){
};
/** append_by_ref **/
JSmarty.prototype.append_by_ref = function(){
};
/** assign **/
JSmarty.prototype.assign = function(key, value)
{
	switch(typeof(value))
	{
		case 'undefined':
			value = null;
			break;
		case 'object':
			for(var i in value) value[i] = value[i];
			break;
	}

	if(typeof key == 'string')
	{
		this._tpl_vars[key] = value;
		return;
	}

	for(var i in key)
	{
		if(i == '') continue;
		this._tpl_vars[i] = key[i];
	}
};
/** assign_by_ref **/
JSmarty.prototype.assign_by_ref = function(key, value)
{
	if(key != '')
		this._tpl_vars[key] = value;
};
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
};
/** clear_all_assign **/
JSmarty.prototype.clear_all_assign = function(){
	this._tpl_vars = {};
};
/** get_template_vars **/
JSmarty.prototype.get_template_vars = function(key){
	return (key) ? this._tpl_vars[key] : this._tpl_vars;
};
/* --------------------------------------------------------------------
 # Template Process
 -------------------------------------------------------------------- */
/** fetch **/
JSmarty.prototype.fetch = function(file)
{
	var temp, type, name = file;

	temp = JSmarty.template;
	type = this.default_resource_type;

	if(!JSAN.includePath[this.plugins_dir])
		JSAN.addRepository(this.plugins_dir);

	if(!temp[file])
	{
		var icp, plugin;

		if((icp = file.indexOf(':')) >= 0)
			name = file.slice(icp+1), type = file.slice(0,icp);

		plugin = this._plugin(type, null, null, 'Resource');
		plugin.source(name, temp, this);
	}

	return this.exec(temp[file]);
};
/** display **/
JSmarty.prototype.display = function(file){
	document.write(this.fetch(file));
};
/** templete_exists **/
JSmarty.prototype.template_exists = function(){
};
/* --------------------------------------------------------------------
 # Plugins
 -------------------------------------------------------------------- */
/** register_block **/
JSmarty.prototype.register_block = function(name, impl){
	this._plugins.Block[name] = impl;
};
/** register_function **/
JSmarty.prototype.register_function = function(name, impl){
	this._plugins.Function[name] = impl;
};
/** register_modifier **/
JSmarty.prototype.register_modifier = function(name, impl){
	this._plguins.Modifier[name] = impl;
};
/** register_compiler_function **/
JSmarty.prototype.register_compiler_function = function(name, impl){
	this._plugins.Compiler[name] = impl;
};
/** unregister_block **/
JSmarty.prototype.unregister_block = function(name){
	this._plugins.Block[name] = false;
};
/** unregister_function **/
JSmarty.prototype.unregister_function = function(name){
	this._plugins.Function[name] = false;
};
/** unregister_mod **/
JSmarty.prototype.unregister_modifier = function(name){
	this._plugins.Modifier[name] = false;
};
/** unregister_compiler_function **/
JSmarty.prototype.unregister_compiler_function = function(name){
	this._plugins.Compiler[name] = false;
};
/* ---------------------------------------------------------------------
 # Filter
 -------------------------------------------------------------------- */
/** load_filter **/
JSmarty.prototype.load_filter = function(type, name){
};
/** register_prefilter **/
JSmarty.prototype.register_prefilter = function(name){
	this._plugins.Prefilter[name] = window[name];
};
/** register_postfilter **/
JSmarty.prototype.register_postfilter = function(name){
	this._plugins.Postfilter[name] = window[name];
};
/** register_outputfilter **/
JSmarty.prototype.register_outputfilter = function(name){
	this._plugins.Outputfilter[name] = false;
};
/** unregister_prefilter **/
JSmarty.prototype.unregister_prefilter = function(name){
	this._plugins.Prefilter[name] = false;
};
/** unregister_postfilter **/
JSmarty.prototype.unregister_postfilter = function(name){
	this._plugins.Postfilter[name] = false;
};
/** unregister_outputfilter **/
JSmarty.prototype.unregister_outputfilter = function(name){
	this._plugins.Outputfilter[name] = false;
};