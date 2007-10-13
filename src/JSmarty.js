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
	compiler_file : 'JSmarty/Compiler.js',
	compiler_class : 'Compiler',

	default_template_handler_func : null,

	$vars : {},
	$foreach : {},
	$section : {},
	$filters : {},
	$template : '',

	/**
	 * assign function
	 * @param {Object} k key
	 * @param {Object} v value
	 */
	assign : function(k, v)
	{
		var o = this.$vars, c = JSmarty.Plugin.get('shared.copy_object');
		if(k instanceof Object){
			for(var i in k){ o[i] = c(k[i])};
		}else if(k != ''){
			o[k] = c(v);
		};
	},
	/**
	 * assign_by_ref function
	 * @param {String} k key
	 * @param {String} v value
	 */
	assign_by_ref : function(k, v){
		if(k != ''){ this.$vars[k] = v; };
	},
	/**
	 * append function
	 * @param {String} k key
	 * @param {String} v value
	 * @param {Boolean} m merge
	 */
	append : function(k, v, m)
	{
		var i, j, n, a = this.$vars[k];
		if(k instanceof Object)
		{
			for(i in k)
			{
				n = k[i];
				if(!(a instanceof Array)){
					a = this.$vars[i] = [];
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
				a = this.$vars[k] = [];
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
		var i, a = this.$vars[k];
		if(k != '' && v != void(0)){
			return;
		};
		if(!(a instanceof Array)){
			a = this.$vars[k] = [];
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
				delete this.$vars[k[i]];
			};
			return;
		};
		if(k != ''){ delete this.$vars[k]; };
	},
	/**
	 * clear_all_assign function
	 */
	clear_all_assign : function(){
		this.$vars = {};
	},
	/**
	 * get_template$vars function
	 * @param {String} k key
	 * @return {Object}
	 */
	get_template_vars : function(k){
		return (k == void(0)) ? this.$vars : this.$vars[k];
	},
	/**
	 * clear_all_cache function
	 */
	clear_all_cache : function(){
		this.cache.clearAll();
	},
	/**
	 * clear_cache function
	 * @param {String} n name
	 */
	clear_cache : function(n){
		this.cache.clear(n);
	},
	/**
	 * is_cashed function
	 * @param {String} n name
	 */
	is_cashed : function(n){
		return this.cache.isExist(n);
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
		var Templatec = JSmarty.Templatec;

		name = this.getTemplateName(name);

		if(this.isDebugging())
		{
			timestamp = new Date().getTime();
			debug = JSmarty.Debugging;
			debug = debug[debug.length] = new JSmarty.Storage
			({
				COMPILETIME : null, EXECUTETIME : null,
				TYPE : 'Template', DEPTH : 0, FILENAME : name
			});
		};

		if(Templatec.isCompiled(name, this) || Templatec.newFunction(name, this))
		{
			if(this.isDebugging()){
				debug.set('COMPILETIME', new Date().getTime() - timestamp);
			};
			result = Templatec.call(name, this);
		};

		if(display)
		{
			JSmarty.System.outputString(result);
			if(this.isDebugging())
			{
				debug.set('EXECUTETIME', new Date().getTime() - timestamp);
				JSmarty.Plugin.get('core.display_debug_console')(null, this);
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
	 * @param {Function} f
	 */
	register_block : function(n, f){
		JSmarty.Plugin.set('block.' + n, f);
	},
	/**
	 * unregister_block function
	 * @param {String} n the name of block plugin.
	 */
	unregister_block : function(n){
		JSmarty.Plugin.clear('block.' + n);
	},
	/**
	 * register_function function
	 * @param {String} n the name of function plugin.
	 * @param {Function} i
	 */
	register_function : function(n, f){
		JSmarty.Plugin.set('function.' + n, f);
	},
	/**
	 * unregister_function function
	 * @param {String} n the name of function plugin.
	 */
	unregister_function : function(n){
		JSmarty.Plugin.clear('function.' + n);
	},
	/**
	 * register_modifier function
	 * @param {String} n the name of modifier plugin.
	 * @param {Function} i
	 */
	register_modifier : function(n, f){
		JSmarty.Plugin.set('modifier.' + n, f);
	},
	/**
	 * unregister_modifier function
	 * @param {String} n the name of modifier plugin.
	 */
	unregister_modifier : function(n){
		JSmarty.Plugin.clear('modifier.' + n);
	},
	register_resource : function(n, f)
	{
		if(f instanceof Array && f.length == 4){
			JSmarty.Plugin.set('resource.' + n, f);
		}else{
			this.trigger_error("malformed function-list for '"+ f +"' in register_resource");
		};
	},
	unregister_resource : function(n){
		JSmarty.Plugin.clear('resource.' + n);
	},
	register_compiler_function : function(n, f){
		JSmarty.Plugin.set('compiler.' + n, f);
	},
	unregister_compiler_function : function(n){
		JSmarty.Plugin.clear('compiler.' + n);
	},
	load_filter : function(t, n)
	{
	},
	/**
	 * register_prefilter function
	 * @param {String} n the name of prefilter
	 */
	register_prefilter : function(n)
	{
		var g = JSmarty.Plugin.get('shared.global')();
		JSmarty.Plugin.get('prefilter.' + n, g[n]);
	},
	/**
	 * unregister_prefilter function
	 * @param {String} n the name of prefilter
	 */
	unregister_prefilter : function(n){
		JSmarty.Plugin.clear('prefilter.' + n);
	},
	/**
	 * register_postfilter function
	 * @param {String} n the name of postfilter
	 */
	register_postfilter : function(n)
	{
		var g = JSmarty.Plugin.get('shared.global')();
		JSmarty.Plugin.set('postfilter.' + n, g[n]);
	},
	/**
	 * unregister_postfilter function
	 * @param {String} n the name of postfilter
	 */
	unregister_postfilter : function(n){
		JSmarty.Plugin.clear('postfilter.' + n);
	},
	/**
	 * register_outputfilter function
	 * @param {String} n the name of postfilter
	 */
	register_outputfilter : function(n)
	{
		var g = JSmarty.Plugin.get('shared.global')();
		JSmarty.Plugin.set('outputfilter.' + n, g[n]);
	},
	/**
	 * unregister_outputfilter function
	 * @param {String} n the name of postfilter
	 */
	unregister_outputfilter : function(n){
		JSmarty.Plugin.clear('outputfilter.' + n);
	},
	/**
	 * trigger_error function
	 * @param {String} m msg
	 * @param {String} l level
	 *
	 */
	trigger_error : function(m, l){
		JSmarty.Logging.main((this.debugging) ? 'warn' : l, 'Process', m);
	},
	/** getter for compiler **/
	getCompiler : function()
	{
		return this.compiler || function(o)
		{
			o.compiler = new JSmarty[o.compiler_class](o);
			return o.compiler;
		}(this);
	},
	getTemplateName : function(n){
		return (0 <= n.indexOf(':')) ? n : this.default_resource_type + ':' + n;
	},
	/**
	 * internals : filter function
	 * @param {String} t type of filter
	 * @param {String} s source
	 * @return {String}
	 */
	$f : function(t, s)
	{
		return s;
	},
	/**
	 * internals: call function
	 * @param {String} n name
	 * @param {Object} a attribute
	 * @param {Object} m modifier
	 * @param {String} s source
	 */
	$p : function(n, a, m, s)
	{
		var t = (s == null) ? 'function' : 'block';
		var r, ns = t + '.' + n;
		var f = JSmarty.Plugin.get(ns, this.plugins_dir);

		switch(t)
		{
			case 'function':
				return this.$m(m, f(a, this));
			case 'block':
				return this.$m(m, f(a, s, this));
		};
	},
	/**
	 * internals: modifier function
	 * @param {Object} m modifier
	 * @param {Object} s source
	 */
	$m : function(m, s)
	{
		var k, d = this.plugins_dir, p = JSmarty.Plugin;
		for(k in m)
		{
			m[k][0] = s;
			s = p.get('modifier.' + k, d).apply(null, m[k]);
		};
		return s;
	}
};

JSmarty.VERSION = '@version@';
JSmarty.Debugging = [];
JSmarty.Classes = {};
