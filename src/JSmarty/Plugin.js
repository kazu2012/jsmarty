JSmarty.Plugin =
{
	/**
	 * Repository
	 * @type Array
	 */
	dir : ['.'],
	/**
	* plugin types
	* @type Object
	*/
	types :
	{
		compiler:true, prefilter:true, postfilter:true, outputfilter:true,
		core:true, block:true, shared:true, 'function':true, modifier:true
	},
	/**
	 * Evalute the source of plugin.
	 * @param  {String} $code The sourcecode of javascript.
	 * @param  {String} $ns namespace of plugin
	 * @return {Boolean} Evalute done, or not.
	 */
	parse : function(c, n)
	{
		var f = true;
		var r = 'return ' + this.realname(n) + ';';

		try
		{
			this[n] = new Function((c || '') + r)();
		}
		catch(e)
		{
			f = false, this[n] = null;
			JSmarty.Logging.warn(n, e);
		};

		return f;
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
	unset : function(n)
	{
		this[n] = null;
		delete(this[n]);
	},
	realname : function(n)
	{
		var e = n.split('.');
		if(e[0] in this.types){
			return ['jsmarty'].concat(e).join('_');
		};
		return e[1];
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
	},
	'shared.global' : function(g){
		return function(){ return g; };
	}(this),
	'shared.notice' : function(){
		JSmarty.Logging.info('Plugin', 'called undefined function');
	},
	'shared.copy_array' : function(a){
		return [].concat(a);
	},
	'shared.copy_object' : function()
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
	},
	'resource.file' :
	[
		function(n, r, j)
		{
			r.set('src', JSmarty.System.read(n, j.template_dir));
			return !!(r.get('src'));
		},
		function(n, r, j)
		{
			r.set('timestamp', JSmarty.System.time(n, j.template_dir));
			return !!(r.get('timestamp'));
		},
		function(){ return true; },
		function(){ return true; }
	]
};
