JSmarty.Compiler.Section = JSmarty.Compiler.extend
(
	'Block',
	{
		toString : function()
		{
			return (!this.isTerminal()) ?
				'self.inSection(' : '})';
		}
	}
);
