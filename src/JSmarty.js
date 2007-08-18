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
	debugging_id : 'DEBUGMODE',
	debugging_ctrl : false,

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

	compiler : null,
	compiler_file  : 'JSmarty/Compiler.js',
	compiler_class : 'Compiler',

	default_template_handler_func : null,

	_vars_ : {},

	_foreach : {},
	_section : {},
	_capture : {},

	_version : '@version@',
	_debuginfo_ : [],
	_plugins :{
		pre:[], post:[], output:[]
	},
	_function : {},
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
				v = JSmarty.Plugin.getFunction('shared.copyObject')(v);
				break;
		};

		if(k instanceof Object)
		{
			for(var i in k){ this._vars_[i] = k[i]; };
			return;
		};

		if(k != ''){ this._vars_[k] = v; };
	},
	/**
	 * assign_by_ref function
	 * @param {String} k key
	 * @param {String} v value
	 */
	assign_by_ref : function(k, v){
		if(k != ''){ this._vars_[k] = v; };
	},
	/**
	 * append function
	 * @param {String} k key
	 * @param {String} v value
	 * @param {Boolean} m merge
	 */
	append : function(k, v, m)
	{
		var i, j, n, a = this._vars_[k];
		if(k instanceof Object)
		{
			for(i in k)
			{
				n = k[i];
				if(!(a instanceof Array)){
					a = this._vars_[i] = [];
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
			if(k != '' && v != void(0)){
				return;
			};
			if(!(a instanceof Array)){
				a = this._vars_[k] = [];
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
		var i, a = this._vars_[k];
		if(k != '' && v != void(0)){
			return;
		};
		if(!(a instanceof Array)){
			a = this._vars_[k] = [];
		};
		if(m && v instanceof Object)
		{
			for(i in v){ a[i] = v[i]; };
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
				delete this._vars_[k[i]];
			};
			return;
		};
		if(k != ''){ delete this._vars_[k]; };
	},
	/**
	 * clear_all_assign function
	 */
	clear_all_assign : function(){
		this._vars_ = {};
	},
	/**
	 * get_template_vars function
	 * @param {String} k key
	 * @return {Object}
	 */
	get_template_vars : function(k){
		return (k == void(0)) ? this._vars_ : this._vars_[k];
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
	clear_compiled_tpl : function(n){
		JSmarty.Templatec.clear(n);
	},
	fetch : function(name, ccid, cpid, display)
	{
		var debug, result, timestamp;

		if(this.isDebugging())
		{
			timestamp = new Date().getTime();
			debug = this._debuginfo_;
			debug = debug[debug.length] = new JSmarty.Storage
			({
				COMPILETIME : null, EXECUTETIME : null,
				TYPE : 'Template', DEPTH : 0, FILENAME : name
			});
		};

		if(this.isCompiled(name) || this.compileResource(name))
		{
			if(this.isDebugging()){
				debug.set('COMPILETIME', new Date().getTime() - timestamp);
			};
			result = JSmarty.Templatec.apply(name, this);
		};

		if(display)
		{
			JSmarty.System.print(result);
			if(this.isDebugging())
			{
				debug.set('EXECUTETIME', new Date().getTime() - timestamp);
				JSmarty.Plugin.getFunction('core.display_debug_console')(null, this);
			};
			return;
		};

		return result;
	},
	isDebugging : function()
	{
		if(!this.debugging && this.debugging_ctrl)
		{
			var s = JSmarty.System.getArgs(this.debugging_id);
			this.debugging = (s.toLowerCase() == 'on') ? true : false;
		};
		return this.debugging;
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
		this._function['block.' + n] = i;
	},
	/**
	 * unregister_block function
	 * @param {String} n the name of block plugin.
	 */
	unregister_block : function(n){
		this._function['block.' + n] = false;
	},
	/**
	 * register_function function
	 * @param {String} n the name of function plugin.
	 * @param {Function} i
	 */
	register_function : function(n, i){
		this._function['function.' + n] = i;
	},
	/**
	 * unregister_function function
	 * @param {String} n the name of function plugin.
	 */
	unregister_function : function(n){
		this._function['function.' + n] = false;
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
		this._function['modifier.' + n] = false;
	},
	register_resource : function(t, i)
	{
		if(i instanceof Array && i.length == 4){
			this._function['resource.' + t] = i;
		}else{
			this.trigger_error("malformed function-list for '"+ t +"' in register_resource");
		};
	},
	unregister_resource : function(n){
		this._function['resource.' + n] = false;
	},
	register_compiler_function : function(n, i){
		this._function['compiler' + n] = i;
	},
	unregister_compiler_function : function(n){
		this._function['compiler.' + n] = false;
	},
	load_filter : function(t, n)
	{
		if(JSmarty.Plugin.addPlugin(t + 'filter.' + n, this.plugins_dir)){
			this._function[t].push(n);
		};
	},
	/**
	 * register_prefilter function
	 * @param {String} n the name of prefilter
	 */
	register_prefilter : function(n){
		this._function['prefilter.' + n] = JSmarty.GLOBALS[n];
	},
	/**
	 * unregister_prefilter function
	 * @param {String} n the name of prefilter
	 */
	unregister_prefilter : function(n){
		this._function['prefilter.' + n] = false;
	},
	/**
	 * register_postfilter function
	 * @param {String} n the name of postfilter
	 */
	register_postfilter : function(n){
		this._function['postfilter.' + n] = JSmarty.GLOBALS[n];
	},
	/**
	 * unregister_postfilter function
	 * @param {String} n the name of postfilter
	 */
	unregister_postfilter : function(n){
		this._function['postfilter.' + n] = false;
	},
	/**
	 * register_outputfilter function
	 * @param {String} n the name of postfilter
	 */
	register_outputfilter : function(n){
		this._function['outputfilter.' + n] = JSmarty.GLOBALS[n];
	},
	/**
	 * unregister_outputfilter function
	 * @param {String} n the name of postfilter
	 */
	unregister_outputfilter : function(n){
		this._function['outputfilter.' + n] = false;
	},
	/**
	 * trigger_error function
	 * @param {String} m msg
	 * @param {String} l level
	 *
	 */
	trigger_error : function(m, l)
	{
		if(!l){ l = 'warn'; };
		if(!this.debugging){ l = 'none'; };
		JSmarty.Error.raise(m, l);
	},
	/**
	 * compile the resource
	 * @param {String} n the name of resource
	 */
	compileResource : function(n)
	{
		var src, info;

		info = new JSmarty.Storage({
			src : null, name : n , type: null
		});

		if(this.fetchResourceInfo(info))
		{
			src = this.compileSource(info.get('src'));
			JSmarty.Templatec.set(n, src);

			return Boolean(src);
		};

		return false;
	},
	/**
	 * compile the given source
	 * @param {String} s source
	 */
	compileSource : function(s)
	{
		try{
			return new Function(this._getCompiler().execute(s));
		}catch(e){
			this.trigger_error();
		};
	},
	/**
	 * test if resource needs compiling
	 * @param {String} n the name of resource
	 * @param {String} p a compile path
	 * @return {Boolean} 
	 */
	isCompiled : function(n, p)
	{
		var info;

		if(!this.force_compile)
		{
			if(JSmarty.Templatec.isExist(n))
			{
				return true;
			};
		};

		return false;
	},
	/**
	 *
	 * @param {Storage} info the information for resource object
	 */
	fetchResourceInfo : function(info)
	{
		var name, func, sret, flag = true;

		info.init('gets', true);
		info.init('quit', false);

		if(this.parseResourceName(info))
		{
			name = info.get('name');
			switch(info.get('type'))
			{
				case 'file':
					if(info.get('gets'))
					{
						info.set('src', JSmarty.System.fgets(name, this.template_dir));
						info.set('timestamp', JSmarty.System.mtime(name, this.template_dir));
					};
					break;
				default:
					call = JSmarty.Plugin.getFunction('resource.' + info.get('type'));
					sret = (info.get('gets')) ? call[0](name, info, this) : true;
					flag = sret && func[1](name, info, this);
					break;
			};
		};

		if(!flag)
		{
			if(!(func = this.default_template_handler_func)){
				this.trigger_error("default template handler function \"this.default_template_handler_func\" doesn't exist.");
			}else{
				flag = func(type, name, info, this);
			};
		};

		return flag;
	},
	/**
	 * parse a resource name
	 * @param {Storage} info the information for resource object.
	 */
	parseResourceName : function(info)
	{
		var flag = true;
		var name = info.get('name');
		var part = name.indexOf(':');

		info.set('type', this.default_resource_type);

		if(part != -1)
		{
			info.set('type', name.slice(0, part));
			info.set('name', name.slice(part + 1));
			flag = JSmarty.Plugin.addPlugin('resource.' + info.get('type'), this.plugins_dir);
		};

		return flag;
	},
	/** getter for compiler **/
	_getCompiler : function()
	{
		if(this.compiler == null){
			this.compiler = new JSmarty[this.compiler_class](this);
		};
		return this.compiler;
	},
	/**
	 * internals : filter function
	 * @param {String} t type of filter
	 * @param {String} s source
	 * @return {String}
	 */
	inFilter : function(t, s)
	{
		var P = JSmarty.Plugin;
		var l = this._plugin[t];

		for(var i=0,f=l.length;i<f;i++){
			s = P.getFunction(t + 'filter.' + l[i])(s, this);
		};

		return s;
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
		var r, ns = t + '.' + n;
		var f = this._function[ns] || JSmarty.Plugin.getFunction(
			ns, this.plugins_dir
		);

		switch(t)
		{
			case 'block': r = f(a, s, this); break;
			case 'function': r = f(a, this); break;
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
		var P = JSmarty.Plugin;
		var f, k, s, n, p = this._function;

		for(k in m)
		{
			m[k][0] = s;
			n = 'modifier.' + k;
			f = p[n] || P.getFunction(n, d);
			s = f.apply(null, m[k]);
		};

		return s;
	}
};

JSmarty.GLOBALS = this;
JSmarty.VERSION = '@version@';
