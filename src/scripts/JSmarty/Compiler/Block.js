JSmarty.Compiler.Block = JSmarty.Classes.create(JSmarty.Compiler.Module,
{
	parse : function()
	{
		if(this.isTerminal())
		{
			this.sPrefix = '';
			this.sString = 'return $b.toString();}())';
			return;
		}
		else
		{
			this.sSuffix = 'function(){var $b = $C("Buffer");';
			this.sString =
				'$.$p('+ this.getName() +',' + this.toParams() +
				','+ this.toModify() +',';
		};

		return this;
	}
});
