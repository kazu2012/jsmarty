JSmarty.Plugin =
{
	/**
	 * Repository
	 * @type Array
	 */
	dir : ['.'],
	/**
	 * additional plugin types
	 * @type Object
	 */
	additional : { php:true },
	F : function()
	{
		JSmarty.Logger.info('called undefined function','from','Plugin');
		return '';
	},
	/**
	 * Evalute the source of plugin.
	 * @param  {String} script The sourcecode of javascript.
	 * @param  {String} namespace namespace of plugin
	 * @return {Boolean} evalute done, or not.
	 */
	parse : function(script, namespace)
	{
		var f, suffix = 'return ' + this.realname(namespace) + ';';

		try
		{
			f = new Function((script || '') + suffix);
			this[namespace] = f();
		}
		catch(e)
		{
			this[namespace] = null;
			JSmarty.Logger.error(e);
		};

		return !!f;
	},
	/**
	 * @param namespace namespace of plugin
	 * @param f function
	 */
	set : function(namespace, f){
		this[namespace] = f;
	},
	/**
	 * @param {String} namespace namaspace of plugin
	 * @param {Array} repository repository path of plugins. 
	 * @type Boolean
	 */
	get : function(namespace, repository)
	{
		return this[namespace] || function(self){
			return (self.add(namespace, repository)) ? self[namespace] : self.F;
		}(this);
	},
	/**
	 * load plugin
	 * @param {String} namespace namaspace of plugin
	 * @param {mixed}  repository The repository path of plugins. 
	 * @type Boolean
	 */
	add : function(namespace, repository)
	{
		return (namespace in this) || this.parse(
			JSmarty.System.read(namespace + '.js', repository || this.dir), namespace
		);
	},
	unset : function(namespace)
	{
		this[namespace] = null;
		delete(this[namespace]);
	},
	realname : function(namespace)
	{
		var names = namespace.split('.');
		if(this.additional[names[0]]){ return names[1]; };
		return ['jsmarty'].concat(names).join('_');
	},
	namespace : function(type, name){
		return type + '.' + name;
	},
	/**
	 * import functions for globalObject
	 * @param {String...}
	 */
	importer : function()
	{
		var i, namespace, dir = this.dir;
		var globalObject = this.get('core.global')();

		for(i=arguments.length-1;0<=i;i--)
		{
			namespace = arguments[i];
			if(this.add(namespace, dir)){
				globalObject[namespace.split('.')[1]] = this[namespace];
			};
		};

		globalObject = null;
	},
	'core.global' : function(globalObject)
	{
		return function()
		{
			var i, c;
			if(arguments.length == 0){
				return globalObject;
			};
			for(i=c=arguments.length-1;0<=i;i--){
				if(arguments[i] in globalObject){ c--; };
			};
			return (c == -1);
		};
	}(this),
	'core.copy_array' : function(v){
		return [].concat(v);
	},
	'core.copy_object' : function(value)
	{
		var Plugin = JSmarty.Plugin;
		switch(typeof(value))
		{
			case 'object':
				switch(true)
				{
					case (value instanceof Array):
						return Plugin['core.copy_array'](value);
					case (value instanceof Object):
						var i, o = {};
						var copy_object = Plugin['core.copy_object'];
						for(i in value){ o[i] = copy_object(value[i]); };
						return o;
				};
				return null;
			case 'undefined':
				return null;
			default:
				return value;
		};
	},
	'resource.file' :
	[
		function(name, item, renderer)
		{
			item.put('src', JSmarty.System.read(name, renderer.template_dir));
			return !!(item.get('src'));
		},
		function(name, item, renderer)
		{
			item.put('timestamp', JSmarty.System.time(name, renderer.template_dir));
			return !!(item.get('timestamp'));
		},
		function(){ return true; },
		function(){ return true; }
	]
};
