/**
 * @package JSmarty
 */
function JSmarty(){};
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
	debugging : true,
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
JSmarty.prototype.clear_compiled_tpl = function(file){
	delete JSmarty.templates_c[file];
};
/* --------------------------------------------------------------------
 # Template Process
 -------------------------------------------------------------------- */
JSmarty.prototype.fetch = function(name, ccid, cpid, display)
{
	var i, filter, results, filters;
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

	for(i in (types = this.autoload_filter))
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
		for(i in (filters = this._plugins.outputfilter))
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
	if(!this._plugins[type + 'filter'][name])
		this._call(name, null, null, type + 'filter');
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
	var cpir, name = this.compiler_class;

	if(!(cpir = this._compiler))
		cpir = this._compiler = new window[name];

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
JSmarty.prototype._fetch_resource_info = function(data)
{
	var flag = false;
	if(data.get == void(0)) data.get = true;
	if(data.bye == void(0)) data.bye = false;

	if(this._parse_resource_name(data))
	{
		var sret, tret, type = data.type, name = data.name;
		var call = this._call(type, null, null, 'resource');

		if(data.get)
			sret = call[0](name, data, this);
		else
			sret = true;
		tret = call[1](name, data, this);
		flag = sret && tret;
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
		JSmarty.use(name, type, this.plugins_dir);
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

	modf = (modf) ? modf.split('|') : [];

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

/**
 * Setup namespaces
 *
 * @param strings
 */
JSmarty.namespace = function()
{
	for(var i=arguments.length-1;i>=0;i--){
		JSmarty[arguments[i]] = {};
	}
};

/**
 * Load plugin
 *
 * @param  type
 * @param  name
 * @param  path
 * @return function | null
 */
JSmarty.use = function(name, type, path)
{
	var pgin = JSmarty.prototype._plugins[type];
	var scpt = '/' + type + '.' + name + '.js';
	var func = JSmarty.toPluginName(name, type);
	var rest, getText = new JSmarty.Connect().getText;

	for(var i=path.length-1;i>=0;i--)
	{
		if(text = getText(path[i] + scpt))
		{
			rest = JSmarty.addFunction(text, pgin, func);
			break;
		}
	}

	return rest;
};

JSmarty.addFunction = function(code, scope, func)
{
	var name;
	if(scope && func)
	{
		name = func.split('_')[2];
		code = code.concat("scope[name] ="+ func +"|| null;");
	}

	try
	{
		eval(code);
		return true;
	}
	catch(e){
		return false;
	}
};

/**
 * Arguments to plugin name
 *
 * @return string
 */
JSmarty.toPluginName = function(name, type)
{
	if(!type) type = 'shared';
	return ['jsmarty', type, name].join('_');
};

JSmarty.Connect = function(){};
JSmarty.Connect.prototype =
{
	XMLHTTP : function()
	{
		if(window.XMLHttpRequest)
			return new XMLHttpRequest;
		else if(window.ActiveXObject)
			return new ActiveXObject('Microsoft.XMLHTTP');
		else
			return null;
	}(),
	getText : function(url)
	{
		var http = this.XMLHTTP;
		http.open('GET', url, false);

		try
		{
			http.send('');
			if(http.status == 200 || http.status == 0)
				var text = http.responseText;
			http.abort();
			return text;
		}
		catch(e){
			return '';
		}
	}
};

JSmarty.namespace('templates_c','shared');