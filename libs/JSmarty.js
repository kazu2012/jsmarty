if(typeof JSmarty_Parser == 'undefined') JSAN.use('JSmarty_Parser');

JSmarty = function(){};

JSmarty.AUTHORS = ['shogo'];
JSmarty.VERSION = '0.0.1M1';
JSmarty.LICENSE = 'LGPL';

JSmarty.template = {};
JSmarty.timestamp = {};

JSmarty.prototype = new JSmarty_Parser;
JSmarty.prototype.debugging = false;
JSmarty.prototype.plugins_dir = ['plugins'];
JSmarty.prototype.template_dir = 'templates';
JSmarty.prototype.default_resource_type = 'file';
JSmarty.prototype.default_template_handler_func = function(){};

/* --------------------------------------------------------------------
 # Template Variables
 -------------------------------------------------------------------- */
/** append **/
JSmarty.prototype.append = function(key, value, merge)
{
	var i, j, vars = this._tpl_vars;

	if(typeof(key) == 'object')
	{
		for(i in key)
		{
			if(!vars[i] || !(vars[i] instanceof Array))
				vars[i] = [];
			if(merge && key[i] instanceof Object)
			{
				for(j in key[i])
					vars[i][j] = key[i][j];
				return;
			}
			vars[i].push(key[i]);
		}
	}
	else
	{
		if(!key && !value) return;
		if(!vars[key] || !(vars[key] instanceof Array))
			vars[key] = [];
		if(merge && value instanceof Object)
		{
			for(i in value)
				vars[key][i] = value[i];
			return;
		}
		vars[key].push(value);
	}
};
/** append_by_ref **/
JSmarty.prototype.append_by_ref = function(key, value, merge)
{
	var vars = this._tpl_vars;

	if(!key && !value) return;
	if(vars[key] && vars[key] instanceof Array)
		vars[key] = [];
	if(merge && value instanceof Object)
	{
		for(var i in value)
			vars[key][i] = value[i];
		return;
	}
	vars[key].push(value);
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

	if(typeof(key) == 'object')
	{
		for(var i in key)
			this._tpl_vars[i] = key[i];
		return;
	}

	if(key) this._tpl_vars[key] = value;
};
/** assign_by_ref **/
JSmarty.prototype.assign_by_ref = function(key, value){
	if(key) this._tpl_vars[key] = value;
};
/** clear_assign **/
JSmarty.prototype.clear_assign = function(key)
{
	if(typeof key == 'object')
	{
		for(var i in key)
			delete this._tpl_vars[key[i]];
		return;
	}

	if(key) delete this._tpl_vars[key];
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
 # Cashing
 -------------------------------------------------------------------- */
JSmarty.prototype.clear_all_cache = function(){
	JSmarty[this.cashe_dir] = {};
};
JSmarty.prototype.clear_cache = function(name){
	delete JSmarty[this.cashe_dir][name];
};
JSmarty.prototype.is_cashed = function(name){
	return JSmarty[this.cashe_dir][name] != void(0);
};
JSmarty.prototype.crear_compiled_tpl = function(file){
	delete JSmarty.template[file];
};
/* --------------------------------------------------------------------
 # Template Process
 -------------------------------------------------------------------- */
/** fetch **/
JSmarty.prototype.fetch = function(file)
{
	var rtpl, type, name = file;

	rtpl = JSmarty.template;
	type = this.default_resource_type;

	if(!rtpl[file])
	{
		var icp, rex, time, list, plugin;
		var L = this.left_delimiter, R = this.right_delimiter;

		time = JSmarty.timestamp;
		list = JSmarty_Parser.BELEMNT;

		if(this.plugins_dir)
		{
			JSAN.addRepository(this.plugins_dir);
			this.plugins_dir = null;
		}

		if((icp = file.indexOf(':')) >= 0)
			name = file.slice(icp+1), type = file.slice(0,icp);

		plugin = this._plugin(type, null, null, 'resource');

		if(!plugin.source(name, rtpl, this))
			this.default_template_handler_func(type, name, rtpl, time, this);

		rex = new RegExp(L+'\\/(.+?)'+R,'g');
		while(res = rex.exec(rtpl[file])) list[res[1]] = true;

		rtpl[file] = this._filter(rtpl[file], 'pre');
		rtpl[file] = this._filter(rtpl[file], 'post');
	}

	return this._filter(this.parse(rtpl[file]), 'output');
};
/** display **/
JSmarty.prototype.display = function(file){
	document.write(this.fetch(file));
};
/** templete_exists **/
JSmarty.prototype.template_exists = function(file){
	return this._plugin('file', null, null, 'resource').source(file, null, this);
};
/* --------------------------------------------------------------------
 # Plugins
 -------------------------------------------------------------------- */
/** register_block **/
JSmarty.prototype.register_block = function(name, impl){
	this._plugins.block[name] = impl;
};
/** register_function **/
JSmarty.prototype.register_function = function(name, impl){
	this._plugins['function'][name] = impl;
};
/** register_modifier **/
JSmarty.prototype.register_modifier = function(name, impl){
	this._plguins.modifier[name] = impl;
};
/** register_resource **/
JSmarty.prototype.register_resource = function(name, impl)
{
	this._plugin.resource[name] = {
		source:impl[0], timestamp:impl[1], secure:impl[2], trusted:impl[3]
	};
};
/** register_compiler_function **/
JSmarty.prototype.register_compiler_function = function(name, impl){
	this._plugins.compiler[name] = impl;
};
/** unregister_block **/
JSmarty.prototype.unregister_block = function(name){
	this._plugins.block[name] = false;
};
/** unregister_function **/
JSmarty.prototype.unregister_function = function(name){
	this._plugins['function'][name] = false;
};
/** unregister_modifier **/
JSmarty.prototype.unregister_modifier = function(name){
	this._plugins.modifier[name] = false;
};
/** unregister_resource **/
JSmarty.prototype.unregister_resource = function(name){
	this._plugins.resource[name] = false;
};
/** unregister_compiler_function **/
JSmarty.prototype.unregister_compiler_function = function(name){
	this._plugins.compiler[name] = false;
};
/* ---------------------------------------------------------------------
 # Filter
 -------------------------------------------------------------------- */
/** load_filter **/
JSmarty.prototype.load_filter = function(type, name){
};
/** register_prefilter **/
JSmarty.prototype.register_prefilter = function(name){
	this._plugins.prefilter[name] = window[name];
};
/** register_postfilter **/
JSmarty.prototype.register_postfilter = function(name){
	this._plugins.postfilter[name] = window[name];
};
/** register_outputfilter **/
JSmarty.prototype.register_outputfilter = function(name){
	this._plugins.outputfilter[name] = window[name];
};
/** unregister_prefilter **/
JSmarty.prototype.unregister_prefilter = function(name){
	this._plugins.prefilter[name] = false;
};
/** unregister_postfilter **/
JSmarty.prototype.unregister_postfilter = function(name){
	this._plugins.postfilter[name] = false;
};
/** unregister_outputfilter **/
JSmarty.prototype.unregister_outputfilter = function(name){
	this._plugins.outputfilter[name] = false;
};
/* ---------------------------------------------------------------------
 # Error
 -------------------------------------------------------------------- */
JSmarty.prototype.trigger_error = function(msg){
	if(this.debugging) alert(msg);
};