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
	var s, f, o = JSmarty.Classes.Resource.fetch(n, this.renderer);

	if(o.isFailure){ return false; };

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