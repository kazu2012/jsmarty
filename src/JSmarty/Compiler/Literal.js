JSmarty.Compiler.Literal = JSmarty.Compiler.extend
(
	'__MODULE__',
	{
		sPrefix : '',
		sSuffix : '',
		sString : '\'));\n',
		parse : function(c)
		{
			c.addElement('plain','literal');

			if(!this.isTerminal())
			{
				var modf = this.toModifier();
				this.sPrefix = 'buf.append(';
				this.sString = 'self.inModify(' + modf + ',' + "'";
			};
		}
	}
);
