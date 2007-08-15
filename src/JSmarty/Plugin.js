JSmarty.Plugin =
{
	/**
	 * Repository
	 * @type Array
	 */
	repos : ['.'],
	/**
	 * Evalute the source of plugin.
	 * @param  {String} $code The sourcecode of javascript.
	 * @param  {String} $ns namespace of plugin
	 * @return {Boolean} Evalute done, or not.
	 */
	parse : function($code, $ns)
	{
		if($code == void(0)) $code = '';
		var $flag = false, $parent = this;
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
	},
	/**
	 * Return blank string.
	 * @return {String} Return blank string.
	 */
	empty : function(){
		return '';
	},

	importer : function()
	{
		var n, p = this;
		var i, f, g = JSmarty.GLOBALS;
		for(i=0,f=arguments.length;i<f;i++)
		{
			n = arguments[i];
			g[n.split('.')[1]] = p[n];
		};
	},
	/**
	 * add a repository of plugin.
	 * @param {String} r repository
	 */
	addRepository : function(){
		Array.prototype.unshift.apply(this.repos, arguments);
	},
	/**
	 * @param {String} n namaspace of plugin
	 * @param {mixed}  d The repository path of plugins. 
	 * @type Boolean
	 */
	getFunction : function(n, r)
	{
		if(!(n in this)){
			this.addPlugin(n, r);
		};
		return this[n] || this.empty;
	},
	/**
	 * Load plugin.
	 * @param {String} n namaspace of plugin
	 * @param {mixed}  r The repository path of plugins. 
	 * @type Boolean
	 */
	addPlugin : function(n, r)
	{
		if(n in this){ return Boolean(this[n]); };
		return this.parse(JSmarty.System.fgets(n + '.js', r || this.repos), n);
	},
	toString : function()
	{
		var s, t, k, w = 73, f = this;
		var buf = new JSmarty.Buffer();

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
	}
};

JSmarty.Plugin['shared.clone'] = function(o)
{
	function f(){};
	f.prototype = o;
	return new f();
};

JSmarty.Plugin['shared.toArray'] = function(o){
	return (o instanceof Array) ? o : [o];
};

JSmarty.Plugin['shared.copyArray'] = function(){
	return Array.prototype.slice.call(arguments);
};

JSmarty.Plugin['shared.copyObject'] = function()
{
	var i, r = {};
	for(i in o){ r[i] = o[i]; };
	return r;
};