JSmarty.Templatec = new JSmarty.Classes.History();
JSmarty.Templatec.call = function(k, o){
	return this.get(k)(o);
};
JSmarty.Templatec.isCompiled = function(n, j)
{
	if(j.force_compile){ return false; };
	return this.isExist(n);
};
JSmarty.Templatec.newFunction = function(n, j)
{
	var s, r = this.fetchResourceObject(n, j);

	if(r.isSucess)
	{
		try
		{
			s = j.getCompiler().execute(r.get('src'));
			f = this.set(r.namespace, new Function('$', s));
			f.timestamp = new Date().getTime();
			return true;
		}
		catch(e){
		};
	};

	return true;
};
JSmarty.Templatec.fetchResourceObject = function(n, j)
{
	var r = this.newResourceObject(n, j);

	if(r.isRequire)
	{
		f = JSmarty.Plugin.get('resource.' + r.type, j.plugins_dir);
		r.isSucess = f[0](r.name, r, j) && f[1](r.name, r, j);
	};

	if(!r.isSucess)
	{
		f = j.default_template_handler_func;
		if(typeof(f) == 'function'){
			r.isSucess = f(r.type, r.name, r, j);
		}else{
			j.trigger_error("default template handler function \"this.default_template_handler_func\" doesn't exist.");
		};
	};

	return r;
};
JSmarty.Templatec.newResourceObject = function(n, j)
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
		isRequire : JSmarty.Plugin.add('resource.' + n[0], j.plugins_dir)
	});
};
