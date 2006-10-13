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
JSmarty.Plugin.__func__ = {};

/**
 * Evalute the source of plugin.
 * @param  {String} $code The sourcecode of javascript.
 * @param  {String} $namespace namespace of plugin
 * @return {Boolean} Evalute done, or not.
 */
JSmarty.Plugin.addFunction = function($code, $ns)
{
	if(!$code) return false;

	var $parent = this.__func__;
	var $func = ('jsmarty.' + $ns ).split('.').join('_');

	try
	{
		eval($code + '$parent[$ns] = '+ $func +' || null;');
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
	return function(){ return ''; };
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

	this.addFunction(
		this.fgets(ns + '.js', dir), ns
	);

	return plugins[ns];
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