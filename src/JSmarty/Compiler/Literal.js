JSmarty.Compiler.Literal = JSmarty.Compiler.extend
(
	'__MODULE__',
	{
		sPrefix : '',
		sSuffix : '',
		sString : '\'));\n',
		parse : function(c)
		{
			var modf;
			if(!this.isTerminal())
			{
				modf = this.toModifier();
				this.sPrefix = 'buf.append(';
				this.sString = 'self.inModify(' + modf + ',' + "'";
			};
		}
	}
);
