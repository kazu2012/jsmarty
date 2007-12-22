JSmarty.Compiler.Compiler = JSmarty.Classes.create(JSmarty.Compiler.Module,
{
	sPrefix : '',
	sSuffix : '',
	parse : function(ctx)
	{
		var lambda = JSmarty.Plugin.get('compiler.' + this.getName().slice(1, -1));
		this.sString = lambda(this, ctx);
		return this;
	}
});
