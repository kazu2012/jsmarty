function JSmarty(){ this.init(); };
JSmarty.prototype =
{
	config_dir   : 'configs',
	compile_dir  : 'templates_c',
	/**
	 * @type {Array}
	 */
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

	$vars : null,
	$foreach : null,
	$section : null,
	$filters : null,
	$version : '@version@',
	$template : null,

	/**
	 * assign function
	 * @param {Object} k key
	 * @param {Object} v value
	 */
	assign : function(k, v)
	{
		var i, o = this.$vars, c = JSmarty.Plugin['util.copy'];
		if(k instanceof Object){
			for(i in k){ o[i] = k[i]};
		}else if(k != ''){
			o[k] = c(v);
		};
		return this;
	},
	/**
	 * assign_by_ref function
	 * @param {String} k key
	 * @param {String} v value
	 */
	assign_by_ref : function(k, v)
	{
		if(k != ''){ this.$vars[k] = v; };
		return this;
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
		return this;
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
		return this;
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
		this.cache[this.get_resource_name(name)] = null;
	},
	/**
	 * is_cashed function
	 * @param {String} n name
	 */
	is_cashed : function(name){
		return !!this.cache[this.get_resource_name(name)];
	},
	/**
	 * clear_compiled_tpl function
	 * @param {String} name the name of template
	 */
	clear_compiled_tpl : function(name){
		JSmarty.Templatec.remove(this.get_resource_name(name));
	},
	fetch : function(name, ccid, cpid, display)
	{
		name = this.get_resource_name(name);

		var Templatec = JSmarty.Templatec;
		var logging, temp = [].concat(this.plugins_dir);
		var result, item = new JSmarty.Classes.Item(name);

		this.plugins_dir = JSmarty.Plugin.repos.concat(this.plugins_dir);

		if(this.is_debugging())
		{
			logging = JSmarty.Logging;
			logging.time('EXECUTE');
			logging.time('COMPILE');
		};

		if
		(
			Templatec.isCompiled(item, this.force_compile) ||
			Templatec.newTemplate(item.load(this), this.get_compiler())
		)
		{
			if(this.is_debugging()){
				logging.timeEnd('COMPILE');
			};
			result = Templatec.call(name, this);
		};

		if(display){
			JSmarty.System.outputString(result);
		};

		this.plugins_dir = temp;

		if(this.is_debugging()){
			logging.timeEnd('EXECUTE');
		};

		return result;
	},
	is_debugging : function()
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
	init : function()
	{
		this.cache = {};
		this.$vars = {};
		this.$foreach = {};
		this.$section = {};
		this.$filters = [];
	},
	/**
	 * register_block function
	 * @param {String} the name of block plugin.
	 * @param {Function}
	 */
	register_block : function(name, impl){
		JSmarty.Plugin.set('block.' + name, impl);
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
	 * @param {Function} impl for plugin
	 */
	register_function : function(name, impl){
		JSmarty.Plugin.set('function.' + name, impl);
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
	register_modifier : function(name, impl){
		JSmarty.Plugin.set('modifier.' + name, impl);
	},
	/**
	 * unregister_modifier function
	 * @param {String} n the name of modifier plugin.
	 */
	unregister_modifier : function(name){
		JSmarty.Plugin.unset('modifier.' + name);
	},
	register_resource : function(name, impl)
	{
		if(impl instanceof Array && impl.length == 4){
			JSmarty.Plugin.set('resource.' + name, impl);
		}else{
			this.trigger_error("malformed function-list for '"+ name +"' in register_resource");
		};
	},
	unregister_resource : function(name){
		JSmarty.Plugin.unset('resource.' + name);
	},
	register_compiler_function : function(name, impl){
		JSmarty.Plugin.set('compiler.' + name, impl);
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
		var g = JSmarty.Plugin['util.global']();
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
		var g = JSmarty.Plugin['util.global']();
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
		var g = JSmarty.Plugin['util.global']();
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
	 * @param {String} error message
	 * @param {String} level
	 */
	trigger_error : function(msg, level){
		JSmarty.Logger.invoke(level)(msg);
	},
	/**
	 * getter for compilerObject
	 * @return {JSmarty.Compiler}
	 */
	get_compiler : function()
	{
		return this.compiler || function($)
		{
			$.compiler = new JSmarty[$.compiler_class]($);
			return $.compiler;
		}(this);
	},
	get_resource_name : function(name){
		return (0 <= name.indexOf(':')) ? name : this.default_resource_type + ':' + name;
	}
};

/**
 * NullFunction
 * @type {function}
 */
JSmarty.$function = function(){ return false; };
