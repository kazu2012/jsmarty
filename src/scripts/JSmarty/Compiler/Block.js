JSmarty.Compiler.Block = JSmarty.Classes.create(JSmarty.Compiler.Module,
{
	sPrefix : '$b.plugin(',
	parse : function()
	{
		if(this.isTerminal())
		{
			this.sPrefix = '';
			this.sString = 'return $b.toString();}())';
		}
		else
		{
			this.sSuffix = '(function(){var $b = new $B($);';
			this.sString = [this.getName(), this.toParams(), this.toModify(), ''].toString();
		};

		return this;
	}
});
