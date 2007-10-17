JSmarty.Classes.Resource = JSmarty.Classes.create(JSmarty.Classes.Storage);
JSmarty.Classes.Resource.extend
({
	src : null,
	type : null,
	name : null,
	namespace : null,
	timestamp : null,
	isFailure : true,
	className : 'Resource',
	initialize : function(args)
	{
		var n = args[0].split(':');
		this.type = n[0];
		this.name = n[1];
		this.namespace = args[0];
	}
});

JSmarty.Classes.Resource.fetch = function(n, r)
{
	var P = JSmarty.Plugin;
	var f, o = new this(n);

	if(P.add('resource.' + o.type, r.plugins_dir))
	{
		f = P.get('resource.' + o.type, r.plugins_dir);
		o.isFailure = !(f[0](o.name, o, r) && f[1](o.name, o, r));
	};

	if(o.isFailure)
	{
		f = r.default_template_handler_func;
		switch(typeof(f))
		{
			case 'function':
				o.isFailure = !f(o.type, o.name, o, r);
				break;
			default:
				r.trigger_error("default template handler function \"this.default_template_handler_func\" doesn't exist.");
				break;
		};
	};

	return o;
};
