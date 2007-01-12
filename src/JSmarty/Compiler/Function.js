JSmarty.Compiler.Function = JSmarty.Compiler.extend
(
	'__MODULE__',
	{
		parse : function(c)
		{
			var name = '"' + this.name + '"';
			var attr = this.toParameter();
			var modf = this.toModifier();

			this.sString = 'self.inCall('+ name + ','+ attr +','+ modf +')';
		}
	}
);