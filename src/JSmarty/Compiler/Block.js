JSmarty.Compiler.Block = JSmarty.Compiler.extend
(
	'__MODULE__',
	{
		prefix : function()
		{
			return (!this.isTerminal()) ?
				'buf.append(' : 'return buf.toString();';
		},
		suffix : function()
		{
			return (!this.isTerminal()) ?
				'function(){var buf = Builder();\n' : ');\n';
		},
		toString : function()
		{
			var name = "'"+ this.name + "'";
			var attr = this.toParameter()
			var modf = this.toModifier();

			return (!this.isTerminal()) ?
				'self.inCall('+ name +','+ attr +','+ modf +',' : '}())';
		}
	}
);