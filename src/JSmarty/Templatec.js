JSmarty.Templatec = JSmarty.Classes.extend(JSmarty.Classes('History'))
({
	renderer : null,
	NullFunction : function(){},
	call : function(k, o){
		return (this.get(k) || this.NullFunction)(o);
	},
	isCompiled : function(n)
	{
		if(this.renderer.force_compile){ return false; };
		return this.containsKey(n);
	},
	newFunction : function(name)
	{
		var src, item = JSmarty.Classes.Item.fetch(name, this.renderer);

		if(!item.get('isFailure'))
		{
			try
			{
				src = this.renderer.getCompiler().execute(item.get('src'));
				this.put(item.get('namespace'), new Function('$', src));
				return true;
			}
			catch(e)
			{
				JSmarty.Logger.error(e, 'from Templatec#newFunction');
			};
		};

		return false;
	}
});
