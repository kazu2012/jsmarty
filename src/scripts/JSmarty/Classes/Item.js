JSmarty.Classes.Item = JSmarty.Classes.create(JSmarty.Classes.HashMap);
JSmarty.Classes.Item.extend
({
	initialize : function(namespace)
	{
		var parts = namespace.split(':');

		this.clear();
		this.put('type', parts[0]);
		this.put('name', parts[1]);
		this.put('namespace', namespace);
	}
});

JSmarty.Classes.Item.fetch = function(name, renderer)
{
	var item = new this(name);
	var f, Plugin = JSmarty.Plugin;
	var dir = renderer.plugins_dir;

	if(Plugin.add('resource.' + item.get('type'), dir))
	{
		f = Plugin.get('resource.' + item.get('type'), dir);
		item.put('isFailure',
			!(f[0](item.get('name'), item, renderer)
			&&f[1](item.get('name'), item, renderer))
		);
	};

	if(item.get('isFailure'))
	{
		f = renderer.default_template_handler_func;
		switch(typeof(f))
		{
			case 'function':
				item.put('isFailure', !f(item.get('type'), item.get('name'), item, renderer));
				break;
			default:
				renderer.trigger_error("default template handler function \"this.default_template_handler_func\" doesn't exist.");
				break;
		};
	};

	return item;
};
