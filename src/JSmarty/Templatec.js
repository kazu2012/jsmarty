JSmarty.Templatec = new JSmarty.Classes.History();
JSmarty.Templatec.renderer = null;
JSmarty.Templatec.call = function(k, o){
	return (this.get(k) || function(){})(o);
};
JSmarty.Templatec.isCompiled = function(n)
{
	if(this.renderer.force_compile){ return false; };
	return this.isExist(n);
};
JSmarty.Templatec.newFunction = function(n)
{
	var s, f, r = this.fetchResourceObject(n);
	if(!r.isSucess){ return false; };

	try
	{
		s = this.renderer.getCompiler().execute(r.get('src'));
		f = this.set(r.namespace, new Function('$', s));
		f.timestamp = new Date().getTime();
		return true;
	}
	catch(e)
	{
		JSmarty.Logging.warn('Templatec', e);
	};

	return false;
};
JSmarty.Templatec.fetchResourceObject = function(n)
{
	var f, r = this.newResourceObject(n);

	if(r.isRequire)
	{
		f = JSmarty.Plugin.get('resource.' + r.type, this.renderer.plugins_dir);
		r.isSucess = f[0](r.name, r, j) && f[1](r.name, r, j);
	};

	if(!r.isSucess)
	{
		f = this.renderer.default_template_handler_func;
		if(typeof(f) == 'function'){
			r.isSucess = f(r.type, r.name, r, j);
		}else{
			this.renderer.trigger_error("default template handler function \"this.default_template_handler_func\" doesn't exist.");
		};
	};

	return r;
};
JSmarty.Templatec.newResourceObject = function(n)
{
	n = n.split(':');
	return new JSmarty.Classes.Storage
	({
		src : null,
		type : n[0],
		name : n.slice(1).join(':'),
		namespace : n.join(':'),
		timestamp : null,
		isSuccess : false,
		isRequire : JSmarty.Plugin.add('resource.' + n[0], this.renderer.plugins_dir)
	});
};
