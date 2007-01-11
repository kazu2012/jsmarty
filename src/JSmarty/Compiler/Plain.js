JSmarty.Compiler.Plain = JSmarty.Compiler.extend
(
	'__MODULE__',
	{
		parse : function(c)
		{
			this.sPrefix = c.getValue('ldelim');
			this.sSuffix = c.getValue('rdelim');
			this.sString = this.text;
		}
	}
);