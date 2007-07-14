/**
 * Provide interfase of Plugin extended JSmarty.System Object
 * @type JSmarty.Plugin Object
 */
JSmarty.Plugin = JSmarty.Utility.clone(JSmarty.System);

/**
 * Stack of plugins
 * @private
 * @type Object
 */
JSmarty.Plugin._func_ = JSmarty.prototype._plugins;

/**
 * Repository of plugins.
 * @type Array
 */
JSmarty.Plugin.repos = ['.'];

/**
 * The empty function
 * @return {String} Return blank string.
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
	var $flag = false, $parent = this._func_;
	var $func = ('jsmarty.' + $ns ).split('.');

	switch($func[1])
	{
		case 'php': $func = $func[2]; break;
		default: $func = $func.join('_'); break;
	};

	try
	{
		$flag = true;
		eval($code + '$parent[$ns] = '+ $func +' || null');
	}
	catch(e)
	{
		JSmarty.Error.raise('Plugin: ' + e.message || e.toString());
	};

	return $flag;
};

/**
 * @param {String} n namaspace of plugin
 * @param {mixed}  d The repository path of plugins. 
 * @type Boolean
 */
JSmarty.Plugin.getFunction = function(n, r)
{
	if(!(n in this._func_)){
		this.addPlugin(n, r);
	};
	return this._func_[n] || this.empty;
};

/**
 * Load plugin.
 * @param {String} n namaspace of plugin
 * @param {mixed}  r The repository path of plugins. 
 * @type Boolean
 */
JSmarty.Plugin.addPlugin = function(n, r)
{
	if(n in this._func_){
		return Boolean(this._func_[n]);
	};
	return this.parse(this.fgets(n + '.js', r || this.repos), n);
};

/**
 * add a repository of plugin.
 * @param {String} r repository
 */
JSmarty.Plugin.addRepository = function(){
	Array.prototype.unshift.apply(this.repos, arguments);
};

JSmarty.Plugin.importer = function()
{
	var n, p = this._func_;
	var i, f, g = JSmarty.GLOBALS;
	for(i=0,f=arguments.length;i<f;i++)
	{
		n = arguments[i];
		g[n.split('.')[1]] = p[n];
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
	var s, t, k, w = 73, f = this._func_;

	buf.append('Table Of Plugins', Array(w).join('-'));

	for(k in f)
	{
		k = k.split('.');
		if(k.length == 2)
		{
			t = (k[0].length < 8) ? '\t\t' : '\t';
			s = Boolean(f[k.join('.')]) ? 'success' : 'failure';
			buf.append('[', k[0], ']', t, k[1], ' -> ', s);
		};
	};

	buf.append(Array(w).join('-'));
	buf.append(Array(w - 33).join(' '), new Date().toString());

	return buf.toString('\n');
};
