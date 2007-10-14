JSmarty.Classes.Resource = function(){};
JSmarty.Classes.Resource.prototype = JSmarty.Classes.create
({
	src : null,
	type : null,
	name : null,
	namespace : null,
	timestamp : null,
	isFailure : true,
	doRequest : false
});

JSmarty.Classes.Resource.fetch = function(n, r)
{
	var P = JSmarty.Plugin;
	var f, o = new this(), s = n.split(':');

	o.type = s[0];
	o.name = s.slice(1).join(':');
	o.doRequest = P.add('resource.' + o.type, r.plugins_dir);

	if(o.doRequest)
	{
		f = P.get('resource.' + o.type, r.plugins_dir);
		o.isFailure = !((o.name, o, r) && f[1](o.name, o, r));
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
