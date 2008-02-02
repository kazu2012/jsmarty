JSmarty.Compiler.Literal = JSmarty.Classes.create(JSmarty.Compiler.Module,
{
	sPrefix : '',
	sSuffix : '',
	sString : '\');',
	parse : function()
	{
		if(!this.isTerminal())
		{
			this.sPrefix = '$b.modify(';
			this.sString = [this.toModify(), '\'']
		};

		return this;
	}
});
