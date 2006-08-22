/**
 * @package JSmarty
 */
function JSmarty(){ /* empty */ };

JSmarty.GLOBALS = self;
JSmarty.VERSION = '0.0.1M1';

JSmarty.shared = {};
JSmarty.templates_c = {};

JSmarty.prototype =
{
/**#@+
 * JSmarty Configuration Section
 */
//	config_dir   : 'configs',
//	compile_dir  : 'templates_c',
	plugins_dir  : ['plugins'],
	template_dir : 'templates',

	debug_tpl : '',
	debugging : false,
	debugging_ctrl : 'NONE',

//	compile_check : true,
	force_compile : false,

//	cache_lifetime : 3600,
//	cache_modified_check : false,

//	trusted_dir : [],

	left_delimiter  : '{',
	right_delimiter : '}',

	compile_id : null,
//	use_sub_dirs : false,

	default_modifiers : [],
	default_resource_type : 'file',

	cache_handler_func : null,
	autoload_filters   : {},

//	config_overwrite    : true,
//	config_booleanize   : true,
//	config_read_hidden  : false,
//	config_fix_newlines : true

	default_template_handler_func : null,
//	compiler_file  : 'JSmarty_Compiler.js',
	compiler_class : 'Compiler',
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
	_capture : {},
	_version : JSmarty.VERSION,
	_compiler : null,
	_tpl_vars : {},
	_smarty_debug_id : '#JSMARTY_DEBUG',
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

	if(key instanceof Object)
	{
		for(var i in key)
			this._tpl_vars[i] = key[i];
		return;
	}

	if(key != '') this._tpl_vars[key] = value;
};

JSmarty.prototype.assign_by_ref = function(key, value){
	if(key != '') this._tpl_vars[key] = value;
};

JSmarty.prototype.append = function(key, value, merge)
{
	var i, k, vars, mkey;

	if(key instanceof Object)
	{
		for(i in key)
		{
			mkey = key[i];
			if(!((vars = this._tpl_vars[i]) instanceof Array))
				vars = this._tpl_vars[i] = [];
			if(merge && mkey instanceof Object)
			{
				for(k in mkey)
					vars[k] = mkey[k];
				return;
			}
			vars.push(mkey);
		}
	}
	else
	{
		if(key != '' && value != void(0)) return;
		if(!((vars = this._tpl_vars[key]) instanceof Array))
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
	if(key != '' && value != void(0)) return;

	if(!((vars = this._tpl_vars[key]) instanceof Array))
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
	if(key instanceof Object)
	{
		for(var i in key)
			delete this._tpl_vars[key[i]];
		return;
	}

	if(key != '') delete this._tpl_vars[key];
};

JSmarty.prototype.clear_all_assign = function(){
	this._tpl_vars = {};
};

JSmarty.prototype.get_template_vars = function(key){
	return (key == void(0)) ? this._tpl_vars[key] : this._tpl_vars;
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
JSmarty.prototype.clear_compiled_tpl = function(name){
	delete JSmarty.templates_c[name];
};
/* --------------------------------------------------------------------
 # Template Process
 -------------------------------------------------------------------- */
JSmarty.prototype.fetch = function(name, ccid, cpid, display)
{
	var i, filter, results;
	var types = this.autoload_filter;
	var filters = this._plugins.outputfilter;
	var cache = this.caching, debug = this.debugging;

	if(!debug && this.debugging_ctrl == 'URL')
	{
		var hash = location.hash;
		var dbid = this._smarty_debug_id;

		if(hash == dbid + '=on')
			debug = true;
		else if(hash == dbid + '=off')
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

	if(cpid == void(0))
		cpid = this.compile_id;

	for(i in types)
	{
		filters = types[i];
		for(filter in filters)
			this.load_filter(filter, filters[filter]);
	}

	if(this._is_compiled(name) || this._compile_resource(name))
	{
		if(debug) info.compile_time = new Date().getTime() - dst;
		results = JSmarty.templates_c[name].call(this);
		for(i in filters)
			results = filters[i](results, this);
	}

	if(display)
	{
		if(results){ document.write(results); }
		if(debug)
		{
			info.exec_time = new Date().getTime() - dst;
	//		document.write(JSmarty.use('display_debug_consol')([], this));
		}
		return;
	}

	return results || '';
};
JSmarty.prototype.display = function(name, ccid, cpid){
	this.fetch(name, ccid, cpid, true);
};
JSmarty.prototype.template_exists = function(file){
	return this._call('file', null, null, 'resource').source(file, null, this);
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
JSmarty.prototype.register_resource = function(type, impl)
{
	if(impl instanceof Array && impl.length == 4)
		this._plugins.resource[type] = impl;
	else
		this.trigger_error("malformed function-list for '"+ type +"' in register_resource");
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
JSmarty.prototype.load_filter = function(type, name)
{
};
JSmarty.prototype.register_prefilter = function(name){
	this._plugins.prefilter[name] = JSmarty.GLOBALS[name];
};
JSmarty.prototype.register_postfilter = function(name){
	this._plugins.postfilter[name] = JSmarty.GLOBALS[name];
};
JSmarty.prototype.register_outputfilter = function(name){
	this._plugins.outputfilter[name] = JSmarty.GLOBALS[name];
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
	var src, data = { name:name };
	if(!this._fetch_resource_info(data)) return false;
	if(src = this._compile_source(name, data.src))
	{
		try
		{
			JSmarty.templates_c[name] = new Function(src);
			JSmarty.templates_c[name].timestamp = data.time;
			return true;
		}
		catch(e){}
		return false;
	}

	return false;
};
JSmarty.prototype._compile_source = function(name, src)
{
	var cpir = this._compiler;
	var name = this.compiler_class;

	if(cpir == null)
	{
		if(JSmarty[name] == void(0)) /* JSAN.use(name) */;
		cpir = this._compiler = new JSmarty[name];
	}

	cpir[name](src, this);
	return cpir.exec(src);
};
JSmarty.prototype._is_compiled = function(name)
{
	var data;

	if(!this.force_compile && !JSmarty.templates_c[name])
	{
		if(this.compile_check) return true;
	//	data = {};
	//	if(!this._fetch_resource_info(data)) return false;
	}

	return false;
};
JSmarty.prototype._fetch_resource_info = function(data)
{
	var flag = true;
	if(data.get == void(0)) data.get = true;
	if(data.bye == void(0)) data.bye = false;

	if(this._parse_resource_name(data))
	{
		switch((type = data.type))
		{
			case 'file':
				data.url = this.template_dir +'/' + data.name;
				if(data.get)
					new JSmarty.File().setData(data);
				break;
			default:
				var name = data.name;
				var call = this._call(type, null, null, 'resource');
				var sret = (data.get) ? call[1](name, data, this) : true;
				flag = sret && call[1](name, data, this);
				break;
		}
	}

	if(!flag)
	{
		if(!(call = this.default_template_handler_func))
			this.trigger_error("default template handler function \"this.default_template_handler_func\" doesn't exist.");
		else
			flag = call(type, name, data, this);
	}

	return flag;
};
JSmarty.prototype._parse_resource_name = function(data)
{
	var name = data.name;
	var part = name.indexOf(':');

	if(part > 1)
	{
		data.type = name.split(0, part);
		data.name = name.split(part + 1);
	}
	else
	{
		data.type = this.default_resource_type;
	}

	return true;
};
/* ---------------------------------------------------------------------
 # Wrapper
 -------------------------------------------------------------------- */

JSmarty.prototype._call = function(name, parm, src, type)
{
	var call = this._plugins[type];

	if(call[name] == void(0))
		new JSmarty.Plugin().addPlugin(name, type, this.plugins_dir);
	if(!call[name]) return '';

	switch(type)
	{
		case 'prefilter':
		case 'postfilter':
		case 'outputfilter':
			return true;
		case 'resource':
			return call[name];
		case 'function':
			return call[name](parm, this);
		case 'block':
			return call[name](parm, src, this);
		case 'modifier':
			return call[name].apply(null, parm);
	}
};

JSmarty.prototype._modf = function(src, modf)
{
	var name, args;

	if(this.default_modifiers)
		modf = modf.concat(this.default_modifiers);
	if(modf.length == 0) return src;

	for(var i=modf.length-1;i>=0;i--)
	{
		args = modf[i].split(':');
		name = args.shift();
		args.unshift(src);

		src = this._call(name, args, null, 'modifier');
	}

	return src;
};

JSmarty.prototype._eval = function(src)
{
	try{ eval(src) }
	catch(e){
		this.trigger_error('');
	};
	return '';
};

/**
 * File I/O class
 * @package JSmarty
 */
JSmarty.File = function(){};
JSmarty.File.prototype =
{
	XMLHTTP : function()
	{
		if(JSmarty.GLOBALS.XMLHttpRequest)
			return new XMLHttpRequest;
		if(JSmarty.GLOBALS.ActiveXObject)
			return new ActiveXObject('Microsoft.XMLHTTP');
		return null;
	}(),
	getText : function(url)
	{
		var data = { url:url };
		return (this.setData(data)) ? data.src : '';
	},
	setData : function(data)
	{
		var http = this.XMLHTTP;
		http.open('GET', data.url, false);
		try
		{
			http.send('')
			if(http.status == 200 || http.status == 0)
			{
				data.src  = http.responseText;
				data.time = new Date(http.getResponseHeader('Last-Modified')).getTime();
			}
			http.abort();
			return true;
		}
		catch(e){ /* empty */ };
		return false;
	}
};

/**
 * JSmarty Plugin class
 * @package JSmarty
 */
JSmarty.Plugin = function(){};
JSmarty.Plugin.prototype = new JSmarty.File();
JSmarty.Plugin.prototype.parse = function(code, name, type)
{
	var __parent, __script = null;

	__parent = (type == 'shared') ?
		JSmarty.shared :
		JSmarty.prototype._plugins[type];

	if(code)
	{
		try
		{
			eval(code);
			__script = eval(['jsmarty', type, name].join('_'));
		}
		catch(e){ /* empty */ };
	}

	__parent[name] = __script;
	return (__script) ? true : false;
};
JSmarty.Plugin.prototype.addPlugin = function(name, type, path)
{
	var code;
	var script = [type, name, 'js'].join('.');

	for(var i=path.length-1;i>=0;i--)
	{
		code = this.getText(path[i] + '/' + script);
		if(code) break;
	}

	return this.parse(code, name, type);
};

/**
 * Error object
 */
JSmarty.Error = function(msg, level)
{
	
};


/**
 * import shared plugins
 * @param string
 */
JSmarty.importer = function()
{
	var i, func;
	var parent = JSmarty.shared;
	var global = JSmarty.GLOBALS;

	for(i=arguments.length-1;i>=0;i--)
	{
		func = arguments[i];
		global[func] = shared[func];
	}
};

