JSmarty.Compiler.Function = JSmarty.Compiler.extend
(
	'__MODULE__',
	{
		toString : function()
		{
			var name = '"' + this.name + '"';
			var attr = this.toParameter();
			var modf = this.toModifier();

			return 'self.inCall('+ name + ','+ attr +','+ modf;
		}
	}
);