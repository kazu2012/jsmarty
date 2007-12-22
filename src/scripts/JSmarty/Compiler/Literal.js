JSmarty.Compiler.Literal = JSmarty.Classes.create(JSmarty.Compiler.Module,
{
	sPrefix : '',
	sSuffix : '',
	sString : '\'));',
	parse : function()
	{
		if(!this.isTerminal())
		{
			var m = this.toModify();
			this.sPrefix = '$b.append(';
			this.sString = '$.$m(' + m + ',' + "'";
		};

		return this;
	}
});
