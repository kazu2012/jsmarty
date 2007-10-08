JSmarty.Plugin =
{
	/**
	 * Repository
	 * @type Array
	 */
	dir : ['.'],
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
			JSmarty.Error.log($ns, e, 'die');
		};

		return $flag;
	},
	/**
	 * @param n namespace of plugin
	 * @param f function
	 */
	set : function(n, f){
		this[n] = f;
	},
	/**
	 * @param {String} n namaspace of plugin
	 * @param {mixed}  d The repository path of plugins. 
	 * @type Boolean
	 */
	get : function(n, r)
	{
		return this[n] || function(o){
			return (o.add(n, r)) ? o[n] : o['shared.notice'];
		}(this);
	},
	/**
	 * load plugin
	 * @param {String} n namaspace of plugin
	 * @param {mixed}  r The repository path of plugins. 
	 * @type Boolean
	 */
	add : function(n, r)
	{
		return (n in this) || this.parse(
			JSmarty.System.read(n + '.js', r || this.dir), n
		);
	},
	/**
	 * @param n namespace of plugin
	 */
	clear : function(n)
	{
		this[n] = null;
		delete this[n];
	},
	namespace : function(t, n){
		return t + '.' + n;
	},
	/**
	 * import functions for global scope
	 * @param {Object} options
	 * @param {String...} 
	 */
	importer : function()
	{
		var i, n, d = this.dir;
		var g = this.get('shared.global')();

		for(i=arguments.length-1;0<=i;i--)
		{
			n = arguments[i];
			if(this.add(n, d)){
				g[n.split('.')[1]] = this[n];
			};
		};
	}
};
JSmarty.Plugin['shared.global'] = function(g){
	return function(){ return g; };
}(this);
JSmarty.Plugin['shared.notice'] = function()
{
	JSmarty.Error.log('Plugin', 'called undefined function');
	return '';
};
JSmarty.Plugin['shared.copy_array'] = function(a){
	return [].concat(a);
};
JSmarty.Plugin['shared.copy_object'] = function(o)
{
	var P = JSmarty.Plugin;
	switch(typeof(o))
	{
		case 'object':
			switch(true)
			{
				case (o instanceof Array):
					return P['shared.copy_array'](o);
				case (o instanceof Object):
					var i, c = {}, f = P['shared.copy_object'];
					for(i in o){ c[i] = f(o[i]); };
					return c;
			};
			return null;
		case 'undefined':
			return null;
		default:
			return o;
	};
};
