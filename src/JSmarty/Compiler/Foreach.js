JSmarty.Compiler.Foreach = JSmarty.Compiler.extend
(
	'__MODULE__',
	{
		parse : function(c)
		{
			if(this.isTerminal())
			{
				this.sPrefix = '';
				this.sString = 'return buf.toString();})';
			}
			else
			{
				var attr = this.toParameter();
				var modf = this.toModifier();

				this.sSuffix = 'function(){var buf = new Builder();\n';
				this.sString = 'self.inForeach('+ attr +','+ modf +',';
			};
		}
	}
);
