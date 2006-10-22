/**
 * Provide interfase of Plugin.
 * extended JSmarty.File Object
 * @type JSmarty.Plugin Object
 */
JSmarty.Plugin = JSmarty.factory(JSmarty.File);

/**
 * Stack of plugin function
 * @private
 * @type Object
 */
JSmarty.Plugin.__func__ = JSmarty.prototype._plugins;

/**
 *
 *
 */
JSmarty.Plugin.empty = function(){
	return '';
};

/**
 * Evalute the source of plugin.
 * @param  {String} $code The sourcecode of javascript.
 * @param  {String} $namespace namespace of plugin
 * @return {Boolean} Evalute done, or not.
 */
JSmarty.Plugin.addFunction = function($code, $ns)
{
	var $parent = this.__func__;
	var $func = ('jsmarty.' + $ns ).split('.').join('_');

	if(!$code)
	{
		$parent = null;
		return false;
	};

	try
	{
		eval($code + '$parent[$ns] = '+ $func +' || null');
		return true;
	}
	catch(e){ /* empty */ };

	return false;
};

/**
 *
 *
 */
JSmarty.Plugin.getFunction = function(ns)
{
	var plugins = this.__func__;
	if(ns in plugins) return plugins[ns];
	return this.empty;
};

/**
 * Load plugin.
 * @param {String} ns namaspace of plugin
 * @param {String | Array} dir The repository path of plugins. 
 * @type Boolean
 */
JSmarty.Plugin.addPlugin = function(ns, dir)
{
	var plugins = this.__func__;
	if(ns in plugins) return plugins[ns];

	if(dir == void(0))
		dir = JSmarty.getSelfPath() + '/internals/';

	return this.addFunction(
		this.fgets(ns + '.js', dir), ns
	);
};

/**
 * Load module.
 * @param {String} ns
 * @param {String} filename
 * @type Boolean
 */
JSmarty.Plugin.addModule = function(ns)
{
};

/**
 * Load template is compiled.
 * @param {String} file
 * @type Boolean
 */
JSmarty.Plugin.addTemplatec = function(file)
{
};

JSmarty.Plugin.importer = function()
{
	var parent = this.__func__;
	var global = JSmarty.GLOBALS;
};