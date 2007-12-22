JSmarty.Compiler.Plainm = JSmarty.Classes.create(JSmarty.Compiler.Module,
{
	parse : function(ctx)
	{
		this.sPrefix = ctx.get('ldelim');
		this.sSuffix = ctx.get('rdelim');
		this.sString = this.getText();

		return this;
	}
});
