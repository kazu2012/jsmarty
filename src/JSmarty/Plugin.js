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
JSmarty.Plugin.parse = function($code, $ns)
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
JSmarty.Plugin.getFunction = function(ns, dir)
{
	if(ns in this.__func__)
		return this.__func__[ns] || this.empty;
	this.addPlugin(ns, dir);
	return this.getFunction(ns, dir);
};

/**
 * Load plugin.
 * @param {String} ns namaspace of plugin
 * @param {String | Array} dir The repository path of plugins. 
 * @type Boolean
 */
JSmarty.Plugin.addPlugin = function(ns, dir)
{
	if(ns in this.__func__)
		return Boolean(this.__func__[ns]);
	if(dir == void(0))
		dir = JSmarty.getSelfPath() + '/internals/';
	return this.parse(this.fgets(ns + '.js', dir), ns);
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