/**
 * FILE:
 * JSmarty.js
 *
 * LICENCE:
 * This library is free software; you can redistribute it and/or modify
 * it under the LGPL2.1 as published by the Free Software Foundation.
 * See the http://www.gnu.org/licenses/lgpl.txt in this distribution.
 *
 * @author shogo < shogo4405 at gmail dot com>
 * @package JSmarty
 * @version @version@
 */

/**
 * Construct a new JSmarty.
 *
 * @class This is the JSmarty class
 * @constructor
 */
function JSmarty(){};

JSmarty.prototype =
{
	config_dir   : 'configs',
	compile_dir  : 'templates_c',
	plugins_dir  : ['plugins'],
	template_dir : 'templates',

	debug_tpl : '',
	debugging : false,
	debugging_ctrl : 'NONE',

	compile_check : true,
	force_compile : false,

	cache_lifetime : 3600,
	cache_modified_check : false,

	trusted_dir : [],

	left_delimiter  : '{',
	right_delimiter : '}',

	compile_id : null,
	use_sub_dirs : false,

	default_modifiers : [],
	default_resource_type : 'file',

	cache_handler_func : null,
	autoload_filters   : null,

	config_class : 'File',
	config_overwrite : true,
	config_booleanize : true,
	config_read_hidden : false,
	config_fix_newlines : true,

	compiler_file  : 'JSmarty/Compiler.js',
	compiler_class : 'Compiler',

	default_template_handler_func : null,

	__vars__ : {},
	__compiler__ : null,

	_foreach : {},
	_section : {},
	_capture : {},
	_version : '@version@',
	_debug_id : 'JSMARTY_DEBUG',
	_debug_info : [],
	_plugins :{
		pre:[], post:[], output:[]
	},
	/**
	 * assign function
	 * @param {String} k key
	 * @param {Object} v value
	 */
	assign : function(k, v)
	{
		switch(typeof(v))
		{
			case 'undefined':
				v = null;
				break;
			case 'object':
				v = JSmarty.Utility.objectcopy(v);
				break;
		};

		if(k instanceof Object)
		{
			for(var i in k){ this.__vars__[i] = k[i]; }
			return;
		};

		if(k != '') this.__vars__[k] = v;
	},
	/**
	 * assign_by_ref function
	 * @param {String} k key
	 * @param {String} v value
	 */
	assign_by_ref : function(k, v){
		if(k != '') this.__vars__[k] = v;
	},
	/**
	 * append function
	 * @param {String} k key
	 * @param {String} v value
	 * @param {Boolean} m merge
	 */
	append : function(k, v, m)
	{
		var i, j, a, n;
		if(k instanceof Object)
		{
			for(i in k)
			{
				n = k[i];
				if(!((a = this.__vars__[i]) instanceof Array)){
					a = this.__vars__[i] = [];
				};
				if(m && n instanceof Object)
				{
					for(j in n){ a[j] = n[j]; };
					return;
				};
				a[a.length] = n;
			};
		}
		else
		{
			if(k != '' && v != void(0)){ return; };
			if(!((a = this.__vars__[k]) instanceof Array)){
				a = this.__vars__[k] = [];
			};
			if(m && v instanceof Object)
			{
				for(i in v){ a[i] = v[i]; };
				return;
			};
			a[a.length] = v;
		};
	},
	/**
	 * append_by_ref function
	 * @param {String} k key
	 * @param {Object} v value
	 * @param {Boolean} m merge
	 */
	append_by_ref : function(k, v, m)
	{
		var i, a;
		if(k != '' && v != void(0)){ return; };
		if(!((a = this.__vars__[k]) instanceof Array)){
			a = this.__vars__[k] = [];
		};
		if(m && v instanceof Object)
		{
			for(i in v){ a[i] = v[i]; }
			return;
		};
		a[a.length] = v;
	},
	/**
	 * clear_assign function
	 * @param {Object} k key
	 */
	clear_assign : function(k)
	{
		if(k instanceof Array)
		{
			for(var i=0,f=k.length;i<f;i++){
				delete this.__vars__[k[i]];
			};
			return;
		};
		if(k != ''){ delete this.__vars__[k]; };
	},
	/**
	 * clear_all_assign function
	 */
	clear_all_assign : function(){
		this.__vars__ = {};
	},
	/**
	 * get_template_vars function
	 * @param {String} k key
	 * @return {Object}
	 */
	get_template_vars : function(k){
		return (k == void(0)) ? this.__vars__ : this.__vars__[k];
	},
	/**
	 * clear_all_cache function
	 */
	clear_all_cache : function()
	{
	},
	/**
	 * clear_cache function
	 * @param {String} n name
	 */
	clear_cache : function(n)
	{
	},
	/**
	 * is_cashed function
	 * @param {String} n name
	 */
	is_cashed : function(n)
	{
	},
	/**
	 * clear_compiled_tpl function
	 * @param {String} n name
	 */
	clear_compiled_tpl : function(n)
	{
	},
	fetch : function(name, ccid, cpid, display)
	{
		var Plugin = JSmarty.Plugin;
		var output = this._plugins.output;
		var debugging = this.debugging;
		var autoload  = this.autoload_filters;
		var i, k, f, debug, index, result, start, filters;

		if(!debugging && this.debugging_ctrl == 'URL')
		{
			switch(JSmarty.getArgs(this._debug_id))
			{
				case 'on':
					debugging = true; break;
				case 'off':
					debugging = false; break;
			};
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

		if(autoload)
		{
			for(i in autoload)
			{
				filters = autoload[i];
				for(k=0,f=filters.length;k<f;k++){
					this.load_filter(i, filters[k]);
				};
			};
		};

		if(cpid == void(0))
			cpid = this.compile_id;

		if(this._is_compiled(name) || this._compile_resource(name))
		{
			if(debugging) debug.compile_time = new Date().getTime() - start;
			result = JSmarty.templates_c[name].call(this);
		};

		// -- outputfilter
		for(i=0,f=output.length;i<f;i++){
			result = Plugin.getFunction('outputfilter.' + output[i])(result, this);
		};

		this.autoload_filters = null;


		if(display)
		{
			if(result){ JSmarty.System.print(result); };
			if(debugging)
			{
				debug.exec_time = new Date().getTime() - start;
			};
			return;
		};

		return result || '';
	},
	display : function(name, ccid, cpid){
		this.fetch(name, ccid, cpid, true);
	},
	template_exists : function(file)
	{
	},
	/**
	 * register_block function
	 * @param {String} n the name of block plugin.
	 * @param {Function} i
	 */
	register_block : function(n, i){
		this._plugins['block.' + n] = i;
	},
	/**
	 * unregister_block function
	 * @param {String} n the name of block plugin.
	 */
	unregister_block : function(n){
		this._plugins['block.' + n] = false;
	},
	/**
	 * register_function function
	 * @param {String} n the name of function plugin.
	 * @param {Function} i
	 */
	register_function : function(n, i){
		this._plugins['function.' + n] = i;
	},
	/**
	 * unregister_function function
	 * @param {String} n the name of function plugin.
	 */
	unregister_function : function(n){
		this._plugins['function.' + n] = false;
	},
	/**
	 * register_modifier function
	 * @param {String} n the name of modifier plugin.
	 * @param {Function} i
	 */
	register_modifier : function(n, i){
		this._plguins['mofifier.' + n] = i;
	},
	/**
	 * unregister_modifier function
	 * @param {String} n the name of modifier plugin.
	 */
	unregister_modifier : function(n){
		this._plugins['modifier.' + n] = false;
	},
	register_resource : function(t, i)
	{
		if(i instanceof Array && i.length == 4){
			this._plugins['resource.' + t] = i;
		}else{
			this.trigger_error("malformed function-list for '"+ t +"' in register_resource");
		};
	},
	unregister_resource : function(n){
		this._plugins['resource.' + n] = false;
	},
	register_compiler_function : function(n, i){
		this._plugins['compiler' + n] = i;
	},
	unregister_compiler_function : function(n){
		this._plugins['compiler.' + n] = false;
	},
	load_filter : function(type, name)
	{
		if(JSmarty.Plugin.addPlugin(type + 'filter.' + name, this.plugins_dir)){
			this._plugins[type].push(name);
		};
	},
	/**
	 * register_prefilter function
	 * @param {String} n the name of prefilter
	 */
	register_prefilter : function(n){
		this._plugins['prefilter.' + n] = JSmarty.GLOBALS[n];
	},
	/**
	 * unregister_prefilter function
	 * @param {String} n the name of prefilter
	 */
	unregister_prefilter : function(n){
		this._plugins['prefilter.' + n] = false;
	},
	/**
	 * register_postfilter function
	 * @param {String} n the name of postfilter
	 */
	register_postfilter : function(n){
		this._plugins['postfilter.' + n] = JSmarty.GLOBALS[n];
	},
	/**
	 * unregister_postfilter function
	 * @param {String} n the name of postfilter
	 */
	unregister_postfilter : function(n){
		this._plugins['postfilter.' + n] = false;
	},
	/**
	 * register_outputfilter function
	 * @param {String} n the name of postfilter
	 */
	register_outputfilter : function(n){
		this._plugins['outputfilter.' + n] = JSmarty.GLOBALS[n];
	},
	/**
	 * unregister_outputfilter function
	 * @param {String} n the name of postfilter
	 */
	unregister_outputfilter : function(n){
		this._plugins['outputfilter.' + n] = false;
	},
	trigger_error : function(msg, level)
	{
		if(!level) level = 'warn';
		if(!this.debugging) level = 'none';
		JSmarty.Error.raise(msg, level);
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
	/**
	 * compile the given source
	 *
	 * @param {String} n the name of resource
	 * @param {String} s source
	 */
	_compile_source : function(n, s)
	{
		var c = this.__compiler__;

		if(c == null)
		{
			try
			{
				c = new JSmarty[this.compiler_class](this);
				this.__compiler__ = c;
			}
			catch(e){
				this.trigger_error();
			};
		};

		try{
			return new Function(c.execute(s));
		}catch(e){
			this.trigger_error();
		};
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
					data.src  = JSmarty.System.fgets(name, this.template_dir);
					data.time = JSmarty.System.mtime(name, this.template_dir);
					break;
				default:
					call = JSmarty.Plugin.getFunction('resource.' + data.type);
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
		var flag = true;
		var name = data.name;
		var part = name.indexOf(':');

		data.type = this.default_resource_type;

		if(part != -1)
		{
			data.type = name.slice(0, part);
			data.name = name.slice(part + 1);
			flag = JSmarty.Plugin.addPlugin('resource.' + data.type, this.plugins_dir);
		};

		return flag;
	},
	/**
	 * internals: call function
	 * @param {String} n name
	 * @param {Object} a attribute
	 * @param {Object} m modifier
	 * @param {String} s source
	 */
	inCall : function(n, a, m, s)
	{
		var t = (s == null) ? 'function' : 'block';
		var r, ns = t + '.' + n, call = this._plugins;

		if(call[ns] == void(0))
			JSmarty.Plugin.addPlugin(ns, this.plugins_dir);
		if(!call[ns]) return '';

		switch(t)
		{
			case 'block': r = call[ns](a, s, this); break;
			case 'function': r = call[ns](a, this); break;
		};

		return this.inModify(m, r);
	},
	/**
	 * internals: modifier function
	 * @param {Object} m modifier
	 * @param {Object} s source
	 */
	inModify : function(m, s)
	{
		var d = this.plugins_dir;
		var Plugin = JSmarty.Plugin;
		var k, plugin = this._plugins;

		for(k in m)
		{
			n = 'modifier.' + k;
			if(plugin[n] || Plugin.addPlugin(n, d))
			{
				m[k][0] = s;
				s = plugin[n].apply(null, m[k]);
			};
		};

		return s;
	},
	/**
	 * internals: wrapper for eval function
	 * @param {String} s
	 */
	inEval : function(s)
	{
		return eval(s);
	},
	/**
	 * internals: foreach function
	 * @param {Object} p params
	 * @param {Object} m modifier
	 * @param {Function} c content
	 * @param {Function} e contentelse
	 * @type String
	 */
	inForeach : function(p, m, c, e)
	{
		var k, i = -1, t = 0, b = [], foreach;

		var from = p.from;
		var key  = p.key  || false;
		var item = p.item || false;
		var name = p.name || null;

		if(!from)
		{
			if(name) this._foreach[name] = { show : false, total : 0 };
			return this.inModify(m, (e) ? e.call(this) : '');
		};

		if(name)
		{
			for(k in from)
			{
				if(!from.hasOwnProperty(k)) continue;
				++t;
			};

			foreach = this._foreach[name] =
			{
				show : true,
				last : false,
				first : true,
				total : t,
				iterarion : 0
			};

			for(k in from)
			{
				if(!from.hasOwnProperty(k)) continue;
				if(t-1 == ++i) foreach.last = true;
				if(key) this.assign(key, k);
				this.assign(item, from[k]);
				b[i] = c.call(this);
				foreach.iteration = i;
				foreach.first = false;
			};

			return this.inModify(m, b.join(''));
		};

		for(k in from)
		{
			if(!from.hasOwnProperty(k)) continue;
			if(key) this.assign(key, k);
			this.assign(item, from[k]);
			b[++i] = c.call(this);
		};

		return this.inModify(m, b.join(''));
	},
	/**
	 * internals: section function
	 * @param {Object} p params
	 * @param {Object} m modifier
	 * @param {Function} c content
	 * @param {Function} e contentelse
	 * @type String
	 */
	inSection : function(p, m, c, e)
	{
		var name = p.name, loop = p.loop;
		var k, t = i = -1, b =[], section;

		if(!loop)
		{
			this._section[name] = { show : false, total : 0 };
			return this.inModify(m, (e) ? e.call(this) : '');
		};

		var max = p.max || loop.length - 1;
		var show = p.show || true;
		var step = p.step || 1;
		var start = p.start || 0;

		for(k = start;k <= max;k += step) ++t;

		section = this._section[name] =
		{
			show : true,
			loop : 0,
			last : false,
			total : t,
			index : 0,
			first : true,
			rownum : 1,
			iteration : 1,
			index_next : 0,
			index_prev : -1
		};

		for(k = start;k <= max;k += step)
		{
			if(t == ++i) section.last = true;
			b[i] = c.call(this, k);
			section.loop++;
			section.index = k + step;
			section.first = false;
			section.rownum++;
			section.iteration++;
			section.index_prev += step;
			section.index_next += step;
		};

		this._section[name] = { show : true, loop : i, total : t };
		return this.inModify(m, b.join(''));
	}
};

JSmarty.GLOBALS = this;
JSmarty.VERSION = '@version@';
JSmarty.templates_c = {};