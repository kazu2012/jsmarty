JSmarty.Compiler.Literal = JSmarty.Compiler.extend
(
	'__MODULE__',
	{
		parse : function(c)
		{
			var modf = this.toModifier();
			this.sPrefix = (!this.isTerminal()) ? 'buf.append(' : '';
			this.sSuffix = (!this.isTerminal()) ? "'" : '';
			this.sString = (!this.isTerminal()) ? 'self.inModify(' + modf + ',' : '\');\n';
		}
	}
);
