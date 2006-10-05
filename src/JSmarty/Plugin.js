/**
 * Provide interfase of Plugin.
 * extend JSmartyFileObject
 * @type JSmartyPluginObject
 */
JSmarty.Plugin = JSmarty.Factory(JSmarty.File);

/**
 * Stack of plugins.
 * @type Object
 */
JSmarty.Plugin.plugins = {};

/**
 * Stack of modules.
 * @type Object
 */
JSmarty.Plugin.modules = {};

/**
 * Evalute the source of plugin.
 * @param  {String} $code - The source code of javascript.
 * @param  {String} $ns - Plugin-name.
 * @return {Boolean} Evalute done, or not.
 */
JSmarty.Plugin.addFunction = function($code, $namespace)
{
};

/**
 * Load plugin.
 * @param {String} ns Namaspace of plugin
 * @param {String | Array} dir The repository path of plugins. 
 * @type Boolean
 */
JSmarty.Plugin.addPlugin = function(ns, dir)
{
	var plugins = this.plugins;
	if(ns in plugins) return plugins[ns];

	plugins[ns] = this.addFunction(
		this.fgets(ns + '.js', dir), ns
	);

	return plugins[ns];
};

/**
 * Load module.
 * @param {String} namespace
 * @param {String} filename
 * @type Boolean
 */
JSmarty.Plugin.addModule = function(file, parent)
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