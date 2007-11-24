JSmarty.Templatec = JSmarty.Classes.extend(JSmarty.Classes('History'))
({
	call : function(k, renderer){
		return (this.get(k) || function(){})(renderer);
	},
	isCompiled : function(item, isForceCompile)
	{
		if(isForceCompile){ return false; };
		return this.containsKey(item.get('namespace'));
	},
	newFunction : function(item, compiler)
	{
		if(!item.get('isFailure'))
		{
			try
			{
				var src = compiler.execute(item.get('src'));
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
