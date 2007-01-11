JSmarty.Compiler.Primitive = JSmarty.Compiler.extend
(
	'__MODULE__',
	{
		parse : function(c)
		{
			this.sPrefix = c.getValue('ldelim');
			this.sSuffix = c.getValue('rdelim');
		},
		toString : function(){
			return this.text;
		}
	}
);