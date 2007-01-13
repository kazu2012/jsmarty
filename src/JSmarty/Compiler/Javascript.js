JSmarty.Compiler.Javascript = JSmarty.Compiler.extend
(
	'__MODULE__',
	{
		sString : '',
		parse : function(c)
		{
			c.addElement('plain','javascript');
		}
	}
);
