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
 * @param  {String} $code The sourcecode of javascript.
 * @param  {String} $namespace namespace of plugin
 * @return {Boolean} Evalute done, or not.
 */
JSmarty.Plugin.addFunction = function($code, $namespace)
{
	if(!$code) return false;

	$namespace = $namespace.split('.');
	var $type = $namespace[0], $func = $namespace[1];

	switch($type)
	{
		case 'shared':
			$parent = JSmarty.shared; break;
		default:
			$parent = JSmarty.prototype._plugins[$type]; break;
	};

	try
	{
		eval($code + '$parent['+ $func +'] = $func;')
		return true;
	}
	catch(e){ /* empty */ };

	return false;
};

/**
 * Load plugin.
 * @param {String} ns namaspace of plugin
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