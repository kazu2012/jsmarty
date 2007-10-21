JSmarty.Templatec = JSmarty.Classes.extend(new JSmarty.Classes.History())
({
	rendrer : null,
	call : function(k, o){
		return (this.get(k) || function(){})(o);
	},
	isCompiled : function(n)
	{
		if(this.renderer.force_compile){ return false; };
		return this.isExist(n);
	},
	newFunction : function(n)
	{
		var s, f, o = JSmarty.Classes.Resource.fetch(n, this.renderer);
		if(o.isFailure){ return false; };

		try
		{
			s = this.renderer.getCompiler().execute(o.get('src'));
			f = this.set(o.namespace, new Function('$', s));
			f.timestamp = new Date().getTime();
			return true;
		}
		catch(e)
		{
			JSmarty.Logging.error(e, 'from Templatec#newFunction');
		};

		return false;
	}
});
