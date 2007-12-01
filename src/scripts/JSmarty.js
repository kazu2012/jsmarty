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
function JSmarty(){ this.initialize(); };

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
		var o = this.$vars, c = JSmarty.Plugin['util.copy'];
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
				delete(this.$vars[k[i]]);
			};
			return;
		};
		if(k != ''){ delete(this.$vars[k]); };
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
		this.cache[this.getTemplateName(name)] = null;
	},
	/**
	 * is_cashed function
	 * @param {String} n name
	 */
	is_cashed : function(name){
		return !!this.cache[this.getTemplateName(name)];
	},
	/**
	 * clear_compiled_tpl function
	 * @param {String} name the name of template
	 */
	clear_compiled_tpl : function(name){
		JSmarty.Templatec.remove(this.getTemplateName(name));
	},
	fetch : function(name, ccid, cpid, display)
	{
		name = this.getTemplateName(name);

		var Templatec = JSmarty.Templatec;
		var logging, temp = [].concat(this.plugins_dir);
		var result, item = new JSmarty.Classes.Item(name);

		this.plugins_dir = JSmarty.Plugin.repos.concat(this.plugins_dir);

		if(this.isDebugging())
		{
			logging = JSmarty.Logging;
			logging.time('EXECUTE');
			logging.time('COMPILE');
		};

		if
		(
			Templatec.isCompiled(item, this.force_compile) ||
			Templatec.newFunction(item.load(this), this.getCompiler())
		)
		{
			if(this.isDebugging()){
				logging.timeEnd('COMPILE');
			};
			result = Templatec.call(name, this);
		};

		if(display){
			JSmarty.System.outputString(result);
		};

		this.plugins_dir = temp;

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
	 * @param {String} the name of block plugin.
	 * @param {Function}
	 */
	register_block : function(name, implement){
		JSmarty.Plugin.set('block.' + name, implement);
	},
	/**
	 * unregister_block function
	 * @param {String} n the name of block plugin.
	 */
	unregister_block : function(name){
		JSmarty.Plugin.unset('block.' + name);
	},
	/**
	 * register_function function
	 * @param {String} the name of function plugin.
	 * @param {Function} implement for plugin
	 */
	register_function : function(name, implement){
		JSmarty.Plugin.set('function.' + name, implement);
	},
	/**
	 * unregister_function function
	 * @param {String} the name of function plugin.
	 */
	unregister_function : function(name){
		JSmarty.Plugin.unset('function.' + name);
	},
	/**
	 * register_modifier function
	 * @param {String} the name of modifier plugin.
	 * @param {Function} i
	 */
	register_modifier : function(name, implement){
		JSmarty.Plugin.set('modifier.' + name, implement);
	},
	/**
	 * unregister_modifier function
	 * @param {String} n the name of modifier plugin.
	 */
	unregister_modifier : function(name){
		JSmarty.Plugin.unset('modifier.' + name);
	},
	register_resource : function(name, implement)
	{
		if(implement instanceof Array && implement.length == 4){
			JSmarty.Plugin.set('resource.' + name, implement);
		}else{
			this.trigger_error("malformed function-list for '"+ name +"' in register_resource");
		};
	},
	unregister_resource : function(name){
		JSmarty.Plugin.unset('resource.' + name);
	},
	register_compiler_function : function(name, implement){
		JSmarty.Plugin.set('compiler.' + name, implement);
	},
	unregister_compiler_function : function(name){
		JSmarty.Plugin.unset('compiler.' + name);
	},
	load_filter : function(t, n)
	{
	},
	/**
	 * register_prefilter function
	 * @param {String} the name of prefilter
	 */
	register_prefilter : function(name)
	{
		var g = JSmarty.Plugin.get('shared.global')();
		JSmarty.Plugin.get('prefilter.' + name, g[name]);
	},
	/**
	 * unregister_prefilter function
	 * @param {String} the name of prefilter
	 */
	unregister_prefilter : function(name){
		JSmarty.Plugin.unset('prefilter.' + name);
	},
	/**
	 * register_postfilter function
	 * @param {String} the name of postfilter
	 */
	register_postfilter : function(name)
	{
		var g = JSmarty.Plugin.get('shared.global')();
		JSmarty.Plugin.set('postfilter.' + name, g[name]);
	},
	/**
	 * unregister_postfilter function
	 * @param {String} the name of postfilter
	 */
	unregister_postfilter : function(name){
		JSmarty.Plugin.unset('postfilter.' + name);
	},
	/**
	 * register_outputfilter function
	 * @param {String} the name of postfilter
	 */
	register_outputfilter : function(name)
	{
		var g = JSmarty.Plugin.get('shared.global')();
		JSmarty.Plugin.set('outputfilter.' + name, g[name]);
	},
	/**
	 * unregister_outputfilter function
	 * @param {String} the name of postfilter
	 */
	unregister_outputfilter : function(name){
		JSmarty.Plugin.unset('outputfilter.' + name);
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
	getTemplateName : function(name){
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
		var f, pluginName = Plugin.name(type, name);

		f = Plugin.get(pluginName, this.plugins_dir);
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
