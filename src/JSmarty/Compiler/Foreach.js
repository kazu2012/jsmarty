JSmarty.Compiler.Foreach = JSmarty.Compiler.extend
(
	'Block',
	{
		toString : function()
		{
			return (!this.isTerminal()) ?
				'self.inForeach(' : '})';
		}
	}
);
