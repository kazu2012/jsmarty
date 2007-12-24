JSmarty.Compiler.Function = JSmarty.Classes.create(JSmarty.Compiler.Module,
{
	parse : function(c)
	{
		this.sString =
			'$.$p('+ this.getName() +','+ this.toParams() +','+ this.toModify() +')';
		return this;
	}
});
