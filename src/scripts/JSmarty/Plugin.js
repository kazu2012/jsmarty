JSmarty.Plugin =
{
	/**
	 * Repository
	 * @type Array
	 */
	repos : ['.'],
	/**
	 * Repository for internals
	 * @type String
	 */
	internals : './internals',
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
	parse : function(script, pluginName)
	{
		var global = this.get('core.global');
		var realname = this.realname(pluginName);
		var f, suffix = 'return ' + realname + ';';

		if(global(realname))
		{
			this[pluginName] = global()[realname];
			return !!this[pluginName];
		};

		try
		{
			if(script){ script += 'return ' + realname +';'; };
			f = new Function(script || 'return null;');
			this[pluginName] = f();
		}
		catch(e)
		{
			this[pluginName] = null;
			JSmarty.Logger.error(e);
		};

		return !!this[pluginName];
	},
	/**
	 * @param {String} the name of plugin
	 * @param {Function}
	 */
	set : function(pluginName, func){
		this[pluginName] = func;
	},
	/**
	 * @param {String} the name of plugin
	 * @param {Array} the path to directory of plugins
	 * @type Boolean
	 */
	get : function(pluginName, repository)
	{
		return this[pluginName] || function(self){
			return (self.add(pluginName, repository)) ? self[pluginName] : self.F;
		}(this);
	},
	/**
	 * load plugin
	 * @param {String} namespace namaspace of plugin
	 * @param {mixed}  repository The repository path of plugins. 
	 * @type Boolean
	 */
	add : function(pluginName, repository)
	{
		return (pluginName in this) || this.parse(
			JSmarty.System.read(pluginName + '.js', repository || this.internals), pluginName
		);
	},
	/**
	 * @param {String} the name of plugin
	 */
	unset : function(pluginName)
	{
		this[pluginName] = null;
		delete(this[pluginName]);
	},
	/**
	 * Return the name of plugin.
	 * @param {String} the type of plugin
	 * @param {String} the name of function
	 * @return the name of plugin.
	 */
	name : function(type, funcName){
		return type + '.' + funcName;
	},
	/**
	 * Return the name of JavaScript function.
	 * @param {String} the 
	 */
	realname : function(pluginName)
	{
		var name = pluginName.split('.');
		if(this.additional[name[0]]){ return name[1]; };
		return ['jsmarty'].concat(name).join('_');
	},
	/**
	 * import functions for globalObject
	 * @param {String...}
	 */
	importer : function()
	{
		var i, pluginName, dir = this.dir;
		var global = this.get('core.global')();

		for(i=arguments.length-1;0<=i;i--)
		{
			pluginName = arguments[i];
			if(this.add(pluginName, dir)){
				global[pluginName.split('.')[1]] = this[pluginName];
			};
		};

		global = null;
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
	'core.clone' : function(o)
	{
		function f(){};
		f.prototype = o;
		return new f();
	},
	'core.copy_array' : function(v){
		return [].concat(v);
	},
	'core.copy_object' : function(value)
	{
		switch(typeof(value))
		{
			case 'object':
				switch(true)
				{
					case (value instanceof Array):
						return JSmarty.Plugin.get('core.copy_array')(value);
					case (value instanceof Object):
						var i, o = {};
						var copy_object = JSmarty.Plugin.get('core.copy_object');
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
