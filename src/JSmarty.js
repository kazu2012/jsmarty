/**
 * File:    JSmarty.js
 *
 * This library is free software. License under the GNU Lesser General
 * Public License as published by the Free Software Foundation(LGPL).
 *
 * @link http://d.hatena.ne.jp/shogo4405/20060727/1153977238
 * @author shogo < shogo4405 at gmail dot com >
 * @version @version@
 */

/**
 * Construct a new JSmarty.
 *
 * @class This is the JSmarty class
 * @constructor
 */
function JSmarty(){};

JSmarty.GLOBALS = this;
JSmarty.VERSION = '@version@';

JSmarty.templates_c = {};

JSmarty.prototype =
{
//	config_dir   : 'configs',
//	compile_dir  : 'templates_c',
	plugins_dir  : ['plugins'],
	template_dir : 'templates',

	debug_tpl : '',
	debugging : false,
	debugging_ctrl : 'NONE',

	compile_check : true,
	force_compile : false,

//	cache_lifetime : 3600,
//	cache_modified_check : false,

	trusted_dir : [],

	left_delimiter  : '{',
	right_delimiter : '}',

	compile_id : null,
	use_sub_dirs : false,

	default_modifiers : [],
	default_resource_type : 'file',

	cache_handler_func : null,
	autoload_filters   : {},

//	config_overwrite    : true,
//	config_booleanize   : true,
//	config_read_hidden  : false,
//	config_fix_newlines : true,

	default_template_handler_func : null,
	compiler_file  : 'JSmarty/Compiler.js',
	compiler_class : 'Compiler',
	config_class   : 'Config_File',

	_foreach : {},
	_section : {},
	_capture : {},
	_version : JSmarty.Version,
	_tpl_vars : {},
	_compiler : null,
	_debug_id : 'JSMARTY_DEBUG',
	_debug_info : [],

	_plugins :{
		prefilter:{}, postfilter:{}, outputfilter:{}
	},
	_filters : {
		prefilter:[], postfilter:[], outputfilter:[]
	},
	assign : function(key, value)
	{
		switch(typeof(value))
		{
			case 'undefined':
				value = null;
				break;
			case 'object':
				value = JSmarty.copy(value);
				break;
		};

		if(key instanceof Object)
		{
			for(var i in key)
				this._tpl_vars[i] = key[i];
			return;
		};

		if(key != '') this._tpl_vars[key] = value;
	},
	assign_by_ref : function(key, value){
		if(key != '') this._tpl_vars[key] = value;
	},
	append : function(key, value, merge)
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
				};
				vars.push(mkey);
			};
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
			};
			vars.push(value);
		};
	},
	append_by_ref : function(key, value, merge)
	{
		if(key != '' && value != void(0)) return;

		if(!((vars = this._tpl_vars[key]) instanceof Array))
			vars = this._tpl_vars[key] = [];
		if(merge && value instanceof Object)
		{
			for(var i in value)
				vars[i] = value[i];
			return;
		};
		vars.push(value);
	},
	clear_assign : function(key)
	{
		if(key instanceof Object)
		{
			for(var i in key)
				delete this._tpl_vars[key[i]];
			return;
		};

		if(key != '')
			delete this._tpl_vars[key];
	},
	clear_all_assign : function(){
		this._tpl_vars = {};
	},
	get_template_vars : function(key){
		return (key == void(0)) ? this._tpl_vars[key] : this._tpl_vars;
	},
	clear_all_cache : function(){
		JSmarty.cache = {};
	},
	clear_cache : function(name){
		delete JSmarty.cache[name];
	},
	is_cashed : function(name){
		return false;
	},
	clear_compiled_tpl : function(name){
		JSmarty.templates_c[name] = null;
	},
	fetch : function(name, ccid, cpid, display)
	{
		var index, start;
		var debugging = this.debugging;
		var i, args, debug, index, result;
		var outputp = this._plugins.outputfilter;
		var outputf = this._filters.outputfilter;

		if(!debugging && this.debugging_ctrl == 'URL')
		{
			args = JSmarty.getArgs(this._debug_id);

			if(args == 'on')
				debugging = true;
			else if(args == 'off')
				debugging = false;
		};

		if(debugging)
		{
			start = new Date().getTime();
			debug = this._debug_info;
			index = debug.length;
			debug = debug[index] = {
				type : 'template', depth: 0, filename : name
			};
		};

		if(cpid == void(0))
			cpid = this.compile_id;

		if(this._is_compiled(name) || this._compile_resource(name))
		{
			if(debugging) debug.compile_time = new Date().getTime() - start;
			result = JSmarty.templates_c[name].call(this);
//			for(i in outputf)
//				result = outputf[i](result, this);
		};

		if(display)
		{
			if(result){ JSmarty.print(result); };
			if(debugging)
			{
				debug.exec_time = new Date().getTime() - start;
//				JSmarty.print(debug.compile_time);
			};
			return;
		};

		return results || '';
	},
	display : function(name, ccid, cpid){
		this.fetch(name, ccid, cpid, true);
	},
	template_exists : function(file){
		return this._call('file', null, null, 'resource').source(file, null, this);
	},
	register_block : function(name, impl){
		this._plugins['block.' + name] = impl;
	},
	register_function : function(name, impl){
		this._plugins['function.' + name] = impl;
	},
	register_modifier : function(name, impl){
		this._plguins['mofifier.' + name] = impl;
	},
	register_resource : function(type, impl)
	{
		if(impl instanceof Array && impl.length == 4)
			this._plugins['resource.' + type] = impl;
		else
			this.trigger_error("malformed function-list for '"+ type +"' in register_resource");
	},
	register_compiler_function : function(name, impl){
		this._plugins['compiler' + name] = impl;
	},
	unregister_block : function(name){
		this._plugins['block.' + name] = false;
	},
	unregister_function : function(name){
		this._plugins['function.' + name] = false;
	},
	unregister_modifier : function(name){
		this._plugins['modifier.' + name] = false;
	},
	unregister_resource : function(name){
		this._plugins['resource.' + name] = false;
	},
	unregister_compiler_function : function(name){
		this._plugins['compiler.' + name] = false;
	},
	load_filter : function(type, name)
	{
		this._plugins[type].push(
			JSmarty.Plugin.addPlugin(type + '.' + name, this.plugins_dir)
		);
	},
	register_prefilter : function(name){
		this._plugins['prefilter.' + name] = JSmarty.GLOBALS[name];
	},
	register_postfilter : function(name){
		this._plugins['postfilter.' + name] = JSmarty.GLOBALS[name];
	},
	register_outputfilter : function(name){
		this._plugins['outputfilter.' + name] = JSmarty.GLOBALS[name];
	},
	unregister_prefilter : function(name){
		this._plugins['prefilter.' + name] = false;
	},
	unregister_postfilter : function(name){
		this._plugins['postfilter.' + name] = false;
	},
	unregister_outputfilter : function(name){
		this._plugins['outputfilter.' + name] = false;
	},
	trigger_error : function(msg, level)
	{
		if(!level) level = 'warn';
		if(!this.debugging) level = 'none;'
		JSmarty.trigger_error(msg, level);
	},
	_compile_resource : function(name)
	{
		var src, data = { name:name };
		if(!this._fetch_resource_info(data)) return false;
		if(src = this._compile_source(name, data.src))
		{
			JSmarty.templates_c[name] = src;
			JSmarty.templates_c[name].timestamp = data.time;
			return true;
		}

		return false;
	},
	_compile_source : function(name, src)
	{
		var cpir = this._compiler;
		var name = this.compiler_class;

		if(cpir == null)
		{
			if(JSmarty[name] == void(0)) /* empty */;
//				JSmarty.Plugin.addModule(this.compiler_file);
			cpir = this._compiler = new JSmarty[name];
		};

		return cpir._compile_file(src, this);
	},
	/**
	 * test if resource needs compiling
	 * @param {String} name - resource_name
	 * @param {String} cpath - compile_path
	 * @return {Boolean} 
	 */
	_is_compiled : function(name, path)
	{
		var data;

		if(!this.force_compile)
		{
			if(JSmarty.templates_c[name])
				return true;
/*
			if(!this.compile_check)
				return true;
			data = { name:name, gets:false };
			if(!this._fetch_resource_info(data))
				return false;
			if(data.timestamp <= JSmarty.File.mtime(path))
				return true;
*/
		};

		return false;
	},
	_fetch_resource_info : function(data)
	{
		var name, call, sret, flag = true;
		if(data.gets == void(0)) data.gets = true;
		if(data.quit == void(0)) data.quit = false;

		if(this._parse_resource_name(data))
		{
			name = data.name;
			switch(data.type)
			{
				case 'file':
					if(!data.gets) break;
					data.src  = JSmarty.File.fgets(name, this.template_dir);
					data.time = JSmarty.File.mtime(name, this.template_dir);
					break;
				default:
					call = this._call(data.type, null, null, 'resource');
					sret = (data.gets) ? call[0](name, data, this) : true;
					flag = sret && call[1](name, data, this);
					break;
			};
		};

		if(!flag)
		{
			if(!(call = this.default_template_handler_func))
				this.trigger_error("default template handler function \"this.default_template_handler_func\" doesn't exist.");
			else
				flag = call(type, name, data, this);
		}

		return flag;
	},
	_parse_resource_name : function(data)
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
	},
	_call : function(name, attr, src, type)
	{
		var call = this._plugins[type];

		if(call[name] == void(0))
			JSmarty.Plugin.addPlugin(type + '.'+ name, this.plugins_dir);
		if(!call[name]) return '';

		switch(type)
		{
			case 'resource':
				return call[name];
			case 'function':
				return call[name](attr, this);
			case 'block':
				return call[name](attr, src, this);
			case 'modifier':
				return call[name].apply(null, attr);
		};
	},
	_modf : function(src, modf)
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
		};

		return src;
	},
	/**
	 * Wrapper for eval() 
	 * @param {String} code - Pure javascript code
	 * @return {mixed}
	 */
	_eval : function(code){
		return eval(code);
	},
	/**
	 * Builtin function for {foreach} block.
	 * @param {Object} params
	 * @param {Function} content
	 * @param {Function} contentelse
	 * @type String
	 */
	_inforeach : function(params, content, contentelse)
	{
		var k, foreach, i = 0, html = [];
		var from = params.from;
		var key  = params.key  || false;
		var item = params.item || false;
		var name = params.name || null;

		if(!from)
		{
			if(name)
			{
				this._foreach[name] = { show : false, total : 0 };
				if(contentelse)
					return contentelse.call(this);
				return '';
			};
			if(contentelse)
				return contentelse.call(this);
			return '';
		};

		if(name)
		{
			foreach = this._foreach[name] =
			{
				show : true,
				last : false,
				first : true,
				total : 0,
				iteration : 0
			};

			for(k in from)
			{
				if(!from.hasOwnProperty(k)) continue;
				foreach.total++;
			};

			total = foreach.total;

			for(k in from)
			{
				if(!from.hasOwnProperty(k)) continue;
				if(key) this.assign(key, k);
				if(++foreach.iteration == total)
					foreach.last = true;
				this.assign(item, from[k]);
				html[i++] = content.call(this);
				foreach.iteration++;
				foreach.first = false;
			};

			return html.join('');
		};

		for(k in from)
		{
			if(!from.hasOwnProperty(k)) continue;
			if(key) this.assign(key, k);
			this.assign(item, from[k]);
			html[i++] = content.call(this);
		};

		return html.join('');
	},
	/**
	 * Builtin function for {section} block.
	 * @param {Object} params
	 * @param {Function} content
	 * @param {Function} contentelse
	 * @type String
	 */
	_insection : function(params, content, contentelse)
	{
		if(!params.name)
		{
			this.trigger_error("section : missing 'name' parameter");
			return '';
		};

		if(!params.loop)
		{
			this._section[params.name] = { show : false, total : 0 };
			if(contentelse)
				return contentelse.call(this);
			return '';
		};

		var k, section, i = 0, html =[];
		var name = params.name, loop = params.loop;

		var max   = params.max || loop.length;
		var show  = params.show || true;
		var step  = params.step || 1;
		var start = params.start || 0;

		section = this._section[name] =
		{
			show : true,
			loop : 0,
			last : false,
			total : 0,
			index : 0,
			first : true,
			rownum : 1,
			iteration : 1,
			index_next : 0,
			index_prev : -1
		};

		for(k=start;k<max;k+=step)
			section.total++;

		// section.first
		html[i++] = content.call(this, start);
		section.first = false;
		section.index = start + step;
		section.rownum++;
		section.iteration++;
		section.index_prev += step;
		section.index_next += step;

		for(k=start+step,max=max-step;k<max;k+=step)
		{
			html[i++] = content.call(this, k);
			section.index = k + step;
			section.rownum++;
			section.iteration++;
			section.index_prev += step;
			section.index_next += step;
		};

		// section last
		section.last = true;
		html[i++] = content.call(this, max);

		this._section[name] =
		{
			show : true,
			loop : section.loop,
			total : section.total
		};

		return html.join('');
	}
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
	};
};

/**
 * Error Handler
 * @param {String} msg message
 * @param {String} level error-level
 */
JSmarty.trigger_error = function(msg, level)
{
	if(msg.message) msg = msg.message;
	msg = 'JSmarty error : ' + msg;

	switch(level)
	{
		case 'warn':
			JSmarty.print(msg);
			break;
		case 'die':
			throw new Error(msg);
			break;
		default:
			break;
	};
};

JSmarty.getSelfPath = function()
{
	var self;
	return function(){ return self; };
}();

JSmarty.getArgs = function(){
	return '';
};

/**
 * Make a clone object and cut chains.
 * @params {Object} obj
 * @return {Object} Return the clone object.
 */
JSmarty.copy = function(obj)
{
	var o = (obj instanceof Array) ? [] : {};
	for(var i in obj) o[i] = obj[i];
	return o;
};

/**
 * Create new extended object.
 * @param {Object} o Super object
 * @return {Object}
 */
JSmarty.factory = function(o)
{
	var f = function(){};
	f.prototype = o;
	return new f;
};

/**
 * 
 * @param {String | Array} obj
 * @return {Array}
 */
JSmarty.flatten = function(obj)
{
	switch(typeof(obj))
	{
		case 'string': return [obj];
		case 'object': return obj;
	};
};

/**
 * Wrapper for document.write
 * @param {String} str
 */
JSmarty.print = function(str){
	document.write(str);
};

/*@file.File@*/
/*@file.Plugin@*/
