JSmarty = function(){};

JSmarty.AUTHORS = ['shogo'];
JSmarty.VERSION = '0.0.1M1';
JSmarty.LICENSE = 'LGPL';

JSmarty.BELEMENT = {};
JSmarty.template = {};
JSmarty.timestamp = {};

JSmarty.prototype = 
{
	debugging : false,
	left_delimiter : '{',
	right_delimiter : '}',
	plugins_dir : ['plugins'],
	template_dir : 'templates',
	compiler_class : 'JSmarty_Compiler',
	autoload_filters : {},
	default_resource_type : 'file',
	default_template_handler_func : function(){},

	_plugins :
	{
		modifier: {}, 'function':{}, block:       {},
		resource: {}, insert:    {}, compiler:    {},
		prefilter:{}, postfilter:{}, outputfilter:{}
	},
	_compiler : null,
	_tpl_vars : {}
};

/* --------------------------------------------------------------------
 # Template Variables
 -------------------------------------------------------------------- */
/** append **/
JSmarty.prototype.append = function(key, value, merge)
{
	var i, j, vars, mkey;

	if(typeof(key) == 'object')
	{
		for(i in key)
		{
			mkey = key[i];
			vars = this._tpl_vars[i];

			if(vars && vars instanceof Array)
				vars = this._tpl_vars[i] = [];
			if(merge && mkey instanceof Object)
			{
				for(j in mkey)
					vars[j] = mkey[j];
				return;
			}
			vars.push(mkey);
		}
	}
	else
	{
		if(!key && !value) return;

		vars = this._tpl_vars[key];

		if(vars && vars instanceof Array)
			vars = this._tpl_vars[key] = [];
		if(merge && value instanceof Object)
		{
			for(i in value)
				vars[i] = value[i];
			return;
		}
		vars.push(value);
	}
};
/** append_by_ref **/
JSmarty.prototype.append_by_ref = function(key, value, merge)
{
	if(!key && !value) return;

	var i, vars = this._tpl_vars[key];

	if(vars && vars instanceof Array)
		vars = this._tpl_vars[key] = [];
	if(merge && value instanceof Object)
	{
		for(i in value)
			vars[i] = value[i];
		return;
	}
	vars.push(value);
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

	if(this.plugins_dir)
	{
		JSAN.addRepository(this.plugins_dir);
		this.plugins_dir = null;
	}

	if(!rtpl[file])
	{
		var icp, time, plugin;

		time = JSmarty.timestamp;

		if((icp = file.indexOf(':')) >= 0)
			name = file.slice(icp+1), type = file.slice(0,icp);

		plugin = this._plugin(type, null, null, 'resource');

		if(!plugin.source(name, rtpl, this))
			this.default_template_handler_func(type, name, rtpl, time, this);

		rtpl[file] = this._compile(rtpl[file]);
	}

	return rtpl[file].call(this);
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
/** _plugin **/
JSmarty.prototype._plugin = function(name, parm, src, type)
{
	var plugin = this._plugins[type];

	if(plugin[name] == void(0))
		plugin[name] = JSAN.require('jsmarty_'+ type +'_'+ name);
	if(!plugin[name]) return '';

	switch(type)
	{
		case 'resource':
			return plugin[name];
		case 'prefilter':
		case 'postfilter':
		case 'outputfilter':
			return plugin[name](src, this);
		case 'function':
			return plugin[name](parm, this);
		case 'block':
			return plugin[name](parm, src, this);
		case 'modifier':
			return plugin[name].apply(null, parm);
	}
};
/** _filter **/
JSmarty.prototype._filter = function(src, type)
{
	var list;

	if(list = this.autoload_filters[type])
	{
		for(var i in list)
			src = this._plugin(list[i], src, type + 'filter');
	}

	return src;
};
/** _modifier **/
JSmarty.prototype._modifier = function(src, modf)
{
	var name, parm;

	modf = (modf) ? [] : modf.split('|');

	if(this.default_modifiers)
		modf = modf.concat(this.default_modifiers);

	for(var i=modf.length-1;i>=0;i--)
	{
		parm = modf[i].split(':');
		name = parm.shift();
		parm.unshift(src);

		src = this._plugin(name, parm, null, 'modifier');
	}

	return src;
};

JSmarty.prototype._compile = function(src)
{
	var res, compiler;
	var L = this.left_delimiter, R = this.right_delimiter;

	if(!(compiler = this._compiler))
	{
		if(!window[this.compiler_class])
			JSAN.require(this.compiler_class);
		compiler = this._compiler = new window[this.compiler_class];
	}

	compiler.left_delimiter  = L;
	compiler.right_delimiter = R;
	compiler.RBLCK.compile(L+'\\/(.+?)'+R,'g');

	while(res = compiler.RBLCK.exec(src))
		compiler._holded_blocks[res[1]] = true;

	if(this.autoload_filters['pre'])
		src = this._filter(src, 'pre');

	src = compiler.compile(src);

	if(this.autoload_filters['post'])
		src = this._filter(src, 'post');

	return new Function(src);
};