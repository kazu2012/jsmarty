JSmarty.Compiler.Foreach = JSmarty.Compiler.extend
(
	'__MODULE__',
	{
		sPrefix : '',
		sString : 'return buf.toString();},',
		toString : function()
		{
			return 'self.inForeach(';
		}
	}
);
