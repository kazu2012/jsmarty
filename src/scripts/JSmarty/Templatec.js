JSmarty.Templatec = JSmarty.Classes.mixin(JSmarty.Classes('History'),
{
	call : function(key, renderer){
		return (this.get(key) || JSmarty.emptyFunction)(renderer);
	},
	isCompiled : function(item, isForceCompile)
	{
		if(isForceCompile){ return false; };
		return this.containsKey(item.get('namespace'));
	},
	newTemplate : function(item, compiler)
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
				JSmarty.Logger.invoke('error')(e, 'from Templatec#newFunction');
			};
		};

		return false;
	}
});
