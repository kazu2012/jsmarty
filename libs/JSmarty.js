/**
 * @package JSmarty
 */
function JSmarty(){ /* empty */ };

JSmarty.GLOBALS = self;
JSmarty.VERSION = '0.0.1M1';

JSmarty.shared = {};
JSmarty.templates_c = {};

(function(Class)
{
/**#@+
 * JSmarty Configuration Section
 */
//	Class.config_dir   = 'configs';
//	Class.compile_dir  = 'templates_c';
	Class.plugins_dir  = ['plugins'];
	Class.template_dir = 'templates';

	Class.debug_tpl = '';
	Class.debugging = false;
	Class.debugging_ctrl = 'NONE';

//	Class.compile_check = true;
	Class.force_compile = false;

//	Class.cache_lifetime = 3600;
//	Class.cache_modified_check = false;

//	Class.trusted_dir = [];

	Class.left_delimiter  = '{';
	Class.right_delimiter = '}';

	Class.compile_id = null;
//	Class.use_sub_dirs = false;

	Class.default_modifiers = [];
	Class.default_resource_type = 'file';

	Class.cache_handler_func = null;
	Class.autoload_filters   = {};

//	Class.config_overwrite    = true;
//	Class.config_booleanize   = true;
//	Class.config_read_hidden  = false;
//	Class.config_fix_newlines = true;

	Class.default_template_handler_func = null;
	Class.compiler_file  = 'JSmarty_Compiler.js';
	Class.compiler_class = 'Compiler';
	Class.config_class   = 'Config_File';

/**#@+
 * END JSmarty Configuration Section
 * @access private
 */
	Class._smarty_debug_id = '#JSMARTY_DEBUG';
	Class._smarty_debug_info = [];

	Class._foreach = {};
	Class._section = {};
	Class._capture = {};
	Class._version = JSmarty.Version;
	Class._tpl_vars = {};
	Class._compiler = null;
	Class._debug_id = 'JSMARTY_DEBUG';
	Class._debug_info = [];
	Class._plugins =
	{
		modifier: {}, 'function':{}, block:       {},
		resource: {}, insert:    {}, compiler:    {},
		prefilter:{}, postfilter:{}, outputfilter:{}
	};

	Class.assign = function(key, value)
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

	Class.assign_by_ref = function(key, value){
		if(key != '') this._tpl_vars[key] = value;
	};

	Class.append = function(key, value, merge)
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

	Class.append_by_ref = function(key, value, merge)
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

	Class.clear_assign = function(key)
	{
		if(key instanceof Object)
		{
			for(var i in key)
				delete this._tpl_vars[key[i]];
			return;
		}

		if(key != '') delete this._tpl_vars[key];
	};

	Class.clear_all_assign = function(){
		this._tpl_vars = {};
	};

	Class.get_template_vars = function(key){
		return (key == void(0)) ? this._tpl_vars[key] : this._tpl_vars;
	};
	/* -----------------------------------------------------------------
	 # Cashing
	 ---------------------------------------------------------------- */
	Class.clear_all_cache = function(){
		JSmarty.cache = {};
	};
	Class.clear_cache = function(name){
		delete JSmarty.cache[name];
	};
	Class.is_cashed = function(name){
		return false;
	};
	Class.clear_compiled_tpl = function(name){
		JSmarty.templates_c[name] = null;
	};
	/* -----------------------------------------------------------------
	 # Template Process
	 ---------------------------------------------------------------- */
	Class.fetch = function(name, ccid, cpid, display)
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

/*
		for(i in types)
		{
			filters = types[i];
			for(filter in filters)
				this.load_filter(filter, filters[filter]);
		}
*/

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
	Class.display = function(name, ccid, cpid){
		this.fetch(name, ccid, cpid, true);
	};
	Class.template_exists = function(file){
		return this._call('file', null, null, 'resource').source(file, null, this);
	};
	/* -----------------------------------------------------------------
	 # Plugins
	 ---------------------------------------------------------------- */
	Class.register_block = function(name, impl){
		this._plugins.block[name] = impl;
	};
	Class.register_function = function(name, impl){
		this._plugins['function'][name] = impl;
	};
	Class.register_modifier = function(name, impl){
		this._plguins.modifier[name] = impl;
	};
	Class.register_resource = function(type, impl)
	{
		if(impl instanceof Array && impl.length == 4)
			this._plugins.resource[type] = impl;
		else
			this.trigger_error("malformed function-list for '"+ type +"' in register_resource");
	};
	Class.register_compiler_function = function(name, impl){
		this._plugins.compiler[name] = impl;
	};
	Class.unregister_block = function(name){
		this._plugins.block[name] = false;
	};
	Class.unregister_function = function(name){
		this._plugins['function'][name] = false;
	};
	Class.unregister_modifier = function(name){
		this._plugins.modifier[name] = false;
	};
	Class.unregister_resource = function(name){
		this._plugins.resource[name] = false;
	};
	Class.unregister_compiler_function = function(name){
		this._plugins.compiler[name] = false;
	};
	/* -----------------------------------------------------------------
	 # Filter
	 ---------------------------------------------------------------- */
	Class.load_filter = function(type, name)
	{
	};
	Class.register_prefilter = function(name){
		this._plugins.prefilter[name] = JSmarty.GLOBALS[name];
	};
	Class.register_postfilter = function(name){
		this._plugins.postfilter[name] = JSmarty.GLOBALS[name];
	};
	Class.register_outputfilter = function(name){
		this._plugins.outputfilter[name] = JSmarty.GLOBALS[name];
	};
	Class.unregister_prefilter = function(name){
		this._plugins.prefilter[name] = false;
	};
	Class.unregister_postfilter = function(name){
		this._plugins.postfilter[name] = false;
	};
	Class.unregister_outputfilter = function(name){
		this._plugins.outputfilter[name] = false;
	};
	/* -----------------------------------------------------------------
	 # Error
	 ---------------------------------------------------------------- */
	Class.trigger_error = function(msg, level)
	{
		if(!this.debugging) level = 'none;'
		if(msg instanceof Object) msg = msg.description || msg;
		JSmarty.trigger_error(msg, level);
	};
	/* -----------------------------------------------------------------
	 # Process
	 ---------------------------------------------------------------- */
	Class._compile_resource = function(name)
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
			catch(e)
			{
			}
			return false;
		}

		return false;
	};
	Class._compile_source = function(name, src)
	{
		var cpir = this._compiler;
		var name = this.compiler_class;

		if(cpir == null)
		{
			if(JSmarty[name] == void(0)) /* JSAN.use(name) */ ;
			cpir = this._compiler = new JSmarty[name];
		}

		return cpir._compile_file(src);
	};
	Class._is_compiled = function(name)
	{
		if(!this.force_compile && !JSmarty.templates_c[name])
		{
			if(this.compile_check) return true;
		//	if(!this._fetch_resource_info(data)) return false;
		}

		return false;
	};
	Class._fetch_resource_info = function(data)
	{
		var flag = true;
		if(data.gets == void(0)) data.gets = true;
		if(data.quit == void(0)) data.quit = false;

		if(this._parse_resource_name(data))
		{
			switch(data.type)
			{
				case 'file':
					data.url = this.template_dir +'/' + data.name;
					if(data.gets)
					{
						data.src  = new JSmarty.File().fread(data.url);
						data.time = new JSmarty.File().mtime(data.url);
					}
					break;
				default:
					var name = data.name;
					var call = this._call(type, null, null, 'resource');
					var sret = (data.gets) ? call[1](name, data.type, this) : true;
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
	Class._parse_resource_name = function(data)
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
	/* -----------------------------------------------------------------
	 # Process
	 ---------------------------------------------------------------- */
	Class._call = function(name, attr, src, type)
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
				return call[name](attr, this);
			case 'block':
				return call[name](attr, src, this);
			case 'modifier':
				return call[name].apply(null, attr);
		}
	};
	Class._modf = function(src, modf)
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
	Class._eval = function(src)
	{
		try{ return eval(src); }
		catch(e){ this.trigger_error() };

		return '';
	};

	Class._inSection = function()
	{
		
	};

	Class._inForeach = function()
	{
		
	};

})(JSmarty.prototype);

/**
 * File I/O class
 * @package JSmarty
 */
JSmarty.File = function(){};
(function(Class)
{
	var global = JSmarty.GLOBALS;

	Class._system = 'http';
	Class._mtimes = {};

	Class.FILESYS = function()
	{
		return false;
	}();

	Class.XMLHTTP = function()
	{
		if(global.XMLHttpRequest)
			return new XMLHttpRequest;
		if(global.ActiveXObject)
			return new ActiveXObject('Microsoft.XMLHTTP');
		return null;
	}();

	Class.fread = function(path)
	{
		var http, file;

		switch(this._system)
		{
			case 'http':
				http = this.XMLHTTP;
				try
				{
					http.open('GET', path, false);
					http.send('');
					file = http.responseText;
					this._mtimes[path] = http.getResponseHeader('Last-Modified');
					http.abort();
					return file;
				}
				catch(e){ /* empty */ }
				return null;
		};

		return null;
	};

	Class.mtime = function(path)
	{
		switch(this._system)
		{
			case 'http':
				return this._mtimes[path];
		};

		return null;
	};

	Class.fputs = function(path, text)
	{
		switch(this._system)
		{
			case 'http':
				return false;
		};

		return false;
	};

})(JSmarty.File.prototype);

/**
 * JSmarty Plugin class
 * @package JSmarty
 */
JSmarty.Plugin = function(){};
JSmarty.Plugin.prototype = new JSmarty.File;
(function(Class)
{
	Class.parse = function(code, name, type)
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

	Class.addPlugin = function(name, type, path)
	{
		var i, code;
		var script = [type, name, 'js'].join('.');

		for(i=path.length-1;i>=0;i--)
		{
			code = this.fread(path[i] + '/' + script);
			if(code) break;
		}

		return this.parse(code, name, type);
	};

})(JSmarty.Plugin.prototype);

/**
 * instance of JSmarty.Plugin
 * @var object
 */
JSmarty.plugin = new JSmarty.Plugin();

/**
 * instance of JSmarty.File
 * @var object
 */
JSmarty.file = new JSmarty.File();

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

/**
 * JSmarty Error Handler
 * @param string
 * @param string
 */
JSmarty.trigger_error = function(msg, level)
{
	switch(level)
	{
		case 'none':
			break;
		case 'warn':
			try{ alert(msg); break; }catch(e){};
			try{ print(msg); break; }catch(e){};
			break;
		case 'die':
		default:
			throw new Error(msg);
			break;
	};
};