JSmarty.Compiler.If = JSmarty.Compiler.extend
(
	'__MODULE__',
	{
		sSuffix : '',
		sPrefix : '',
		toString : function()
		{
			return (this.isTerminal()) ?
				'if(){\n' : '\n}';
		}
	}
);
