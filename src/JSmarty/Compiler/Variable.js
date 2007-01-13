JSmarty.Compiler.Variable = JSmarty.Compiler.extend
(
	'__MODULE__',
	{
		parse : function(c)
		{
			var modf = this.toModifier();
			var name = '@@COMPILER::VARIABLE@@' + this.getValue('name');
			this.sString = 'self.inModify('+ modf +','+ name +')';
		}
	}
);
