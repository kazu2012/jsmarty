JSmarty.Compiler.Function = JSmarty.Classes.create(JSmarty.Compiler.Module,
{
	sPrefix : '$b.plugin(',
	parse : function(c)
	{
		this.sString = [this.getName(),this.toParams(), this.toModify()].toString();
		return this;
	}
});
