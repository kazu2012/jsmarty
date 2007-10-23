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
function JSmarty()
{
	this.initialize();
	delete(this.initialize);
};
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

	caching : 0,
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
		var o = this.$vars, c = JSmarty.Plugin.get('core.copy_object');
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
		this.cache = {};
	},
	/**
	 * clear_cache function
	 * @param {String} n name
	 */
	clear_cache : function(name){
		this.cache[this.getResourceName(name)] = null;
	},
	/**
	 * is_cashed function
	 * @param {String} n name
	 */
	is_cashed : function(name){
		return !!this.cache[this.getResourceName(name)];
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
		var result, logging, Templatec;

		name = this.getResourceName(name);

		Templatec = JSmarty.Templatec;
	//	Templatec.setRenderer(this);
		Templatec.renderer = this;

		if(this.isDebugging())
		{
			logging = JSmarty.Logging;
			logging.time('EXECUTE');
			logging.time('COMPILE');
		};

		if(Templatec.isCompiled(name) || Templatec.newFunction(name))
		{
			if(this.isDebugging()){
				logging.timeEnd('COMPILE');
			};
			result = Templatec.call(name, this);
		};

		if(display){
			JSmarty.System.outputString(result);
		};

		if(this.isDebugging()){
			logging.timeEnd('EXECUTE');
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
	initialize : function(){
		this.cache = {};
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
		JSmarty.Plugin.unset('block.' + n);
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
		JSmarty.Plugin.unset('function.' + n);
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
		JSmarty.Plugin.unset('modifier.' + n);
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
		JSmarty.Plugin.unset('resource.' + n);
	},
	register_compiler_function : function(n, f){
		JSmarty.Plugin.set('compiler.' + n, f);
	},
	unregister_compiler_function : function(n){
		JSmarty.Plugin.unset('compiler.' + n);
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
		JSmarty.Plugin.unset('prefilter.' + n);
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
		JSmarty.Plugin.unset('postfilter.' + n);
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
		JSmarty.Plugin.unset('outputfilter.' + n);
	},
	/**
	 * trigger_error function
	 * @param {String} m msg
	 * @param {String} l level
	 */
	trigger_error : function(m, l){
		JSmarty.Logging[l || 'warn'](m, 'from', 'JSmarty');
	},
	/** getter for compiler **/
	getCompiler : function()
	{
		return this.compiler || function(self)
		{
			self.compiler = new JSmarty[self.compiler_class](self);
			return self.compiler;
		}(this);
	},
	getResourceName : function(name){
		return (0 <= name.indexOf(':')) ? name : this.default_resource_type + ':' + name;
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
	$p : function(name, params, modify, src)
	{
		var Plugin = JSmarty.Plugin;
		var type = (src != null) ? 'block' : 'function';
		var f, namespace = Plugin.namespace(type, name);

		f = Plugin.get(namespace, this.plugins_dir);
		if(type == 'function'){
			return this.$m(modify, f(params, this));
		}
		return this.$m(modify, f(params, src, this));
	},
	/**
	 * internals: modifier function
	 * @param {Object} m modifier
	 * @param {Object} s source
	 */
	$m : function(modify, src)
	{
		var dir = this.plugins_dir;
		var k, Plugin = JSmarty.Plugin;

		for(k in modify)
		{
			modify[k][0] = src;
			src = Plugin.get('modifier.' + k, dir).apply(null, modify[k]);
		};

		return src;
	}
};

JSmarty.VERSION = '@version@';
