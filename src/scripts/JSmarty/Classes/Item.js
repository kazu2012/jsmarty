JSmarty.Classes.Item = JSmarty.Classes.create(JSmarty.Classes.HashMap);
JSmarty.Classes.Item.extend
({
	main : function(namespace)
	{
		var parts = namespace.split(':');

		this.clear();
		this.put('type', parts[0]);
		this.put('name', parts[1]);
		this.put('namespace', namespace);
	},
	load : function(renderer)
	{
		var f, Plugin = JSmarty.Plugin;
		var dir = renderer.plugins_dir;

		if(Plugin.add('resource.' + this.get('type'), dir))
		{
			f = Plugin.get('resource.' + this.get('type'), dir);
			this.put('isFailure',
				!(f[0](this.get('name'), this, renderer)
				&&f[1](this.get('name'), this, renderer))
			);
		};

		if(this.get('isFailure'))
		{
			f = renderer.default_template_handler_func;
			switch(typeof(f))
			{
				case 'function':
					this.put('isFailure', !f(this.get('type'), this.get('name'), this, renderer));
					break;
				default:
					renderer.trigger_error("default template handler function \"this.default_template_handler_func\" doesn't exist.");
					break;
			};
		};

		return this;
	}
});
