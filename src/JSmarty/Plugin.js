/**
 * Provide interfase of Plugin.
 * extended JSmarty.File Object
 * @type JSmarty.Plugin Object
 */
JSmarty.Plugin = JSmarty.Utility.factory(JSmarty.System);

/**
 * Stack of Plugins
 * @private
 * @type Object
 */
JSmarty.Plugin.__func__ = JSmarty.prototype._plugins;

/**
 * Return blank string.
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
	if($code == void(0)) $code = '';
	var $flag = false, $parent = this.__func__;
	var $func = ('jsmarty.' + $ns ).split('.');

	switch($func[1])
	{
		case 'php': $func = $func[2]; break;
		default: $func = $func.join('_'); break;
	};

	try{ $flag = true; eval($code + '$parent[$ns] = '+ $func +' || null'); }
	catch(e){ JSmarty.trigger_error('Plugin: ' + e.toString(), 'warn'); };

	return $flag;
};

/**
 * @param {String} ns namaspace of plugin
 * @param {String | Array} dir The repository path of plugins. 
 * @type Boolean
 */
JSmarty.Plugin.getFunction = function(ns, dir)
{
	if(ns in this.__func__)
		return this.__func__[ns] || this.empty;
	if(this.addPlugin(ns, dir))
		return this.__func__[ns];
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
	if(ns in this.__func__)
		return Boolean(this.__func__[ns]);
	if(dir == void(0))
		dir = JSmarty.System.getSelfPath() + '/internals';
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

JSmarty.Plugin.importer = function()
{
	var name, parent = this.__func__;
	var i, f, global = JSmarty.GLOBALS;
	for(i=0,f=arguments.length;i<f;i++)
	{
		name = arguments[i];
		global[name.split('.')[1]] = parent[name];
	};
};

/**
 * Return the table of plugins.
 * @type String
 */
JSmarty.Plugin.toString = function()
{
	var k, i = 0, str = [];
	var date = new Date().toString();
	var width = 72, func = this.__func__;

	str[i++] = 'Table Of Plugins';
	str[i++] = new Array(width + 1).join('-');

	for(k in func)
	{
		k = k.split('.');
		if(k.length == 2)
		{
			str[i] = '['+ k[0] + ']\t' + k[1] + ' -> ';
			str[i] += Boolean(func[k.join('.')]) ? 'success' : 'failure';
			i++;
		};
	};

	str[i++] = new Array(width + 1).join('-');
	str[i++] = new Array(width -32).join(' ') + date;

	return str.join('\n');
};
