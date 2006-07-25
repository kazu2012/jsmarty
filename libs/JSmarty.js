JSmarty = function(){};

JSmarty.AUTHORS = ['shogo'];
JSmarty.VERSION = '0.0.1M1';
JSmarty.LICENSE = 'LGPL';

/**
 * Purpose: Execute 'shared' function
 *
 * @param string name of function
 * @return function
 */
JSmarty.exec = function(name)
{
	var func = 'jsmarty_shared_' + name;
	if(window[func] == void(0))
		window[func] = JSAN.require(func);
	return window[func] || function(){};
};

/**
 * Purpose: setup namespaces
 *
 * @param strings
 * @return void
 */
JSmarty.namespace = function()
{
	for(var i=arguments.length-1;i>=0;i--){
		JSmarty[arguments[i]] = {};
	}
};

JSmarty.prototype = 
{
/**#@+
 * JSmarty Configuration Section
 */
	config_dir   : 'configs',
	compile_dir  : 'templates_c',
	plugins_dir  : ['plugins'],
	template_dir : 'templates',

	debug_tpl : '',
	debugging : false,
	debugging_ctrl : 'URL',

//	compile_check : true,
	force_compile : false,

//	cache_dir : 'cache',
//	cache_lifetime : 3600,
//	cache_modified_check : false,

//	trusted_dir : [],

	left_delimiter  : '{',
	right_delimiter : '}',

//	compile_id : null,
//	use_sub_dirs : false,

	default_modifiers : [],
	default_resource_type : 'file',

	cache_handler_func : function(){},
	autoload_filters   : {},

//	config_overwrite    : true,
//	config_booleanize   : true,
//	config_read_hidden  : false,
//	config_fix_newlines : true

	default_template_handler_func : null,

	compiler_class : 'JSmarty_Compiler',
	config_class   : 'Config_File',

/**#@+
 * END JSmarty Configuration Section
 * @access private
 */
	_plugins :
	{
		modifier: {}, 'function':{}, block:       {},
		resource: {}, insert:    {}, compiler:    {},
		prefilter:{}, postfilter:{}, outputfilter:{}
	},
	_foreach : {},
	_section : {},
	_compiler : null,
	_tpl_vars : {},
	_smarty_vars : {},
	_smarty_debug_id : '#JSMARTYDEBUG',
	_version : JSmarty.version,
	_smarty_debug_info : []
};

/* --------------------------------------------------------------------
 # Template Variables
 -------------------------------------------------------------------- */
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

JSmarty.prototype.assign_by_ref = function(key, value){
	if(key) this._tpl_vars[key] = value;
};

JSmarty.prototype.append = function(key, value, merge)
{
	var i, j, vars, mkey;

	if(typeof(key) == 'object')
	{
		for(i in key)
		{
			mkey = key[i];
			if((vars = this._tpl_vars[i]) && vars instanceof Array)
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
		if((vars = this._tpl_vars[key]) && vars instanceof Array)
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

JSmarty.prototype.append_by_ref = function(key, value, merge)
{
	if(!key && !value) return;

	if((vars = this._tpl_vars[key]) && vars instanceof Array)
		vars = this._tpl_vars[key] = [];
	if(merge && value instanceof Object)
	{
		for(var i in value)
			vars[i] = value[i];
		return;
	}
	vars.push(value);
};

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

JSmarty.prototype.clear_all_assign = function(){
	this._tpl_vars = {};
};

JSmarty.prototype.get_template_vars = function(key){
	return (key) ? this._tpl_vars[key] : this._tpl_vars;
};
/* --------------------------------------------------------------------
 # Cashing
 -------------------------------------------------------------------- */
JSmarty.prototype.clear_all_cache = function(){
	JSmarty.cache = {};
};
JSmarty.prototype.clear_cache = function(name){
	delete JSmarty.cache[name];
};
JSmarty.prototype.is_cashed = function(name){
	return false;
};
JSmarty.prototype.clear_compiled_tpl = function(file){
	delete JSmarty.templates_c[file];
};
/* --------------------------------------------------------------------
 # Template Process
 -------------------------------------------------------------------- */
JSmarty.prototype.fetch = function(name, ccid, cpid, display)
{
	var params, compid, results, filter, filters;
	var cache = this.caching, debug = this.debugging;

	JSAN.addRepository(this.plugins_dir);

	if(!debug && this.debugging_ctrl == 'URL')
	{
		var hash = location.hash;
		var dbid = this._smarty_debug_id;

		if(hash === dbid + '=on')
			debug = true;
		else if(hash === dbid + '=off')
			debug = false;
	}

	if(debug)
	{
		var dst  = new Date().getTime();
		var info = this._smarty_debug_info;
		var idx  = info.length;

		info = info[idx] =
			   {
					type : 'template',
					depth: 0,
					filename : name
			   };
	}

	for(var types in this.autoload_filter)
	{
		filters = types[i];
		for(filter in filters){
			this.load_filter(filter, filters[filter]);
		}
	}

	if(this._is_compiled(name) || this._compile_resource(name))
	{
		if(debug) info.compile_time = new Date().getTime() - dst;
		results = JSmarty.templates_c[name].call(this);
	}

	if(display)
	{
		if(results){ document.write(results); }
		if(debug)
		{
			info.exec_time = new Date().getTime() - dst;
			document.write(JSmarty.exec('display_debug_consol')([], this));
		}
		return;
	}

	return results || '';
};
JSmarty.prototype.display = function(name, ccid, cpid){
	this.fetch(name, ccid, cpid, true);
};
JSmarty.prototype.template_exists = function(file){
	return this._plugin('file', null, null, 'resource').source(file, null, this);
};
/* --------------------------------------------------------------------
 # Plugins
 -------------------------------------------------------------------- */
JSmarty.prototype.register_block = function(name, impl){
	this._plugins.block[name] = impl;
};
JSmarty.prototype.register_function = function(name, impl){
	this._plugins['function'][name] = impl;
};
JSmarty.prototype.register_modifier = function(name, impl){
	this._plguins.modifier[name] = impl;
};
JSmarty.prototype.register_resource = function(name, impl){
	this._plugin.resource[name] = impl;
};
JSmarty.prototype.register_compiler_function = function(name, impl){
	this._plugins.compiler[name] = impl;
};
JSmarty.prototype.unregister_block = function(name){
	this._plugins.block[name] = false;
};
JSmarty.prototype.unregister_function = function(name){
	this._plugins['function'][name] = false;
};
JSmarty.prototype.unregister_modifier = function(name){
	this._plugins.modifier[name] = false;
};
JSmarty.prototype.unregister_resource = function(name){
	this._plugins.resource[name] = false;
};
JSmarty.prototype.unregister_compiler_function = function(name){
	this._plugins.compiler[name] = false;
};
/* ---------------------------------------------------------------------
 # Filter
 -------------------------------------------------------------------- */
JSmarty.prototype.load_filter = function(type, name){
};
JSmarty.prototype.register_prefilter = function(name){
	this._plugins.prefilter[name] = window[name];
};
JSmarty.prototype.register_postfilter = function(name){
	this._plugins.postfilter[name] = window[name];
};
JSmarty.prototype.register_outputfilter = function(name){
	this._plugins.outputfilter[name] = window[name];
};
JSmarty.prototype.unregister_prefilter = function(name){
	this._plugins.prefilter[name] = false;
};
JSmarty.prototype.unregister_postfilter = function(name){
	this._plugins.postfilter[name] = false;
};
JSmarty.prototype.unregister_outputfilter = function(name){
	this._plugins.outputfilter[name] = false;
};
/* ---------------------------------------------------------------------
 # Error
 -------------------------------------------------------------------- */
JSmarty.prototype.trigger_error = function(msg){
	if(this.debugging) alert(msg);
};
/* ---------------------------------------------------------------------
 # Process
 -------------------------------------------------------------------- */
JSmarty.prototype._compile_resource = function(name)
{
	var parm = { name:name };
	if(!this._fetch_resource_info(parm)) return false;
	if(src = this._compile_source(name, parm.src))
	{
		try
		{
			JSmarty.templates_c[name] = new Function(src);
			JSmarty.templates_c[name].timestamp = parm.time;
			return true;
		}
		catch(e){}
		return false;
	}

	return false;
};
JSmarty.prototype._compile_source = function(name, src)
{
	var cpir, name = this.compiler_class;

	if(!(cpir = this._compiler))
	{
		if(window[name] === void(0)) JSAN.use(name);
		if(window[name] === void(0)) return false;
		cpir = this._compiler = new window[name];
	}

	cpir[name](src, this);
	return cpir.exec(src);
};
JSmarty.prototype._is_compiled = function(name)
{
	if(!this.force_compile && !JSmarty.templates_c[name])
	{
		if(this.compile_check) return true;
	}

	return false;
};
JSmarty.prototype._fetch_resource_info = function(parm)
{
	var flag = false;
	if(parm.get == void(0)) parm.get = true;
	if(parm.bye == void(0)) parm.bye = false;

	if(this._parse_resource_name(parm))
	{
		var sret, tret, type = parm.type, name = parm.name;
		var call = this._plugin(type, null, null, 'resource');

		if(parm.get)
			sret = call[0](name, parm, this);
		else
			sret = true;
		tret = call[1](name, parm, this);
		flag = sret && tret;
	}

	if(!flag)
	{
		if(!(call = this.default_template_handler_func))
			this.trigger_error("default template handler function \"this.default_template_handler_func\" doesn't exist.");
		else
			flag = call(type, name, parm, this);
	}

	return flag;
};
JSmarty.prototype._parse_resource_name = function(param)
{
	var name = param.name;
	var part = name.indexOf(':');

	if(part > 1)
	{
		param.type = name.split(0, part);
		param.name = name.split(part + 1);
	}
	else
	{
		param.type = this.default_resource_type;
	}

	return true;
};
/* ---------------------------------------------------------------------
 # Wrapper
 -------------------------------------------------------------------- */
/** _plugin **/
JSmarty.prototype._plugin = function(name, parm, src, type)
{
	var call = this._plugins[type];

	if(call[name] == void(0))
		call[name] = JSAN.require('jsmarty_'+ type +'_'+ name);
	if(!call[name]) return '';

	switch(type)
	{
		case 'resource':
			return call[name];
		case 'prefilter':
		case 'postfilter':
		case 'outputfilter':
			return call[name](src, this);
		case 'function':
			return call[name](parm, this);
		case 'block':
			return call[name](parm, src, this);
		case 'modifier':
			return call[name].apply(null, parm);
	}
};

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

JSmarty.namespace('cache','templates_c');