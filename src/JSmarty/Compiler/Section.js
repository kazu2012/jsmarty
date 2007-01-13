JSmarty.Compiler.Section = JSmarty.Compiler.extend
(
	'__MODULE__',
	{
		parse : function(c)
		{
			if(this.isTerminal())
			{
				this.sPrefix = '';
				this.sString = 'return buf.toString();})';
			}
			else
			{
				var attr = this.toParameter();
				var modf = this.toModifier();
				var name = this.extract(attr, 'name').slice(1,-1);

				this.sSuffix = 'function('+ name +'){var buf = new Builder();\n';
				this.sString = 'self.inSection('+ attr +','+ modf +',';
			};
		},
		extract : function(s, k)
		{
			var r = s.match(RegExp(k + ':([^,}]+)'));
			return (r) ? r[1] : '';
		}
	}
);
