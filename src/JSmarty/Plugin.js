/**
 * Provide interfase of Plugin extended JSmarty.System Object
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
 * Repository of plugins.
 * @private
 * @type Array
 */
JSmarty.Plugin.__repo__ = [];

/**
 * empty function
 * Return blank string.
 * @return {String}
 */
JSmarty.Plugin.empty = function(){
	return '';
};

/**
 * Evalute the source of plugin.
 * @param  {String} $code The sourcecode of javascript.
 * @param  {String} $ns namespace of plugin
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
 * @param {mixed}  dir The repository path of plugins. 
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
 * @param {mixed}  dir The repository path of plugins. 
 * @type Boolean
 */
JSmarty.Plugin.addPlugin = function(ns, dir)
{
	if(ns in this.__func__)
		return Boolean(this.__func__[ns]);
	if(dir == void(0))
		dir = this.getSelfPath() + '/internals';
	return this.parse(this.fgets(ns + '.js', dir), ns);
};

JSmarty.Plugin.addRepository = function()
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
 * toString function
 * Return the table of plugins.
 * @return {String}
 */
JSmarty.Plugin.toString = function()
{
	var buf = new JSmarty.Buffer();
	var s, t, k, func = this.__func__;
	var w = 73, date = new Date().toString();

	buf.append('Table Of Plugins', Array(w).join('-'));

	for(k in func)
	{
		k = k.split('.');
		if(k.length == 2)
		{
			t = (k[0].length < 8) ? '\t\t' : '\t';
			s = Boolean(func[k.join('.')]) ? 'success' : 'failure';
			buf.append('['+ k[0] + ']'+ t + k[1] + ' -> ' + s);
		};
	};

	buf.append(Array(w).join('-'), Array(w - 33).join(' '), date);

	return buf.toString('\n');
};
