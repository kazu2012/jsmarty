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
			JSmarty.Error.log('Plugin', e, 'die');
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
			return (o.add(n, r)) ? o[n] : o['__none__'];
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
	remove : function(n)
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
		var g = this.get('__global__')();

		for(i=arguments.length-1;0<=i;i--)
		{
			n = arguments[i];
			if(this.add(n, d)){
				g[n.split('.')[1]] = this[n];
			};
		};
	}
};
JSmarty.Plugin['__none__'] = function()
{
	JSmarty.Error.log('Plugin', 'called undefined function');
	return '';
};
JSmarty.Plugin['__global__'] = function(g){
	return function(){ return g; };
}(this);
JSmarty.Plugin['shared.copyArray'] = function(a){
	return Array.prototype.slice.call(a);
};
JSmarty.Plugin['shared.mergeObject'] = function(s, c){
	for(var k in s){ if(!(k in c)){ c[k] = s[k];}; };
};
