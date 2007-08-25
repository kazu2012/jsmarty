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
	empty : function()
	{
		JSmarty.Error.raise('Plugin: called empty function.');
		return '';
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
		this.addPlugin(n, r);
		return this[n] || this.empty;
	},
	/**
	 * Load plugin.
	 * @param {String} n namaspace of plugin
	 * @param {mixed}  r The repository path of plugins. 
	 * @type Boolean
	 */
	addPlugin : function(n, r){
		return (n in this) || this.parse(JSmarty.System.fgets(n + '.js', r || this.repos), n);
	},
	/**
	 * import functions for global scope
	 * @param {Object} options
	 * @param {String...} 
	 */
	importFunction : function()
	{
		var i = arguments.length - 1;
		var o = arguments[i];
		var p = o.prefix || '';
		var d = o.plugin_dir || this.repos;
		if(typeof(o) == 'object'){ i--; };

		for(;0<=i;i--)
		{
			n = p + arguments[i];
			if(this.addPlugin(n, d)){
				g[n.split('.')[1]] = this[n];
			};
		};
	}
};

JSmarty.Plugin['shared.toArray'] = function(o){
	return (o instanceof Array) ? o : [o];
};

JSmarty.Plugin['shared.copyArray'] = function(a){
	return Array.prototype.slice.call(a);
};