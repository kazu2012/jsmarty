JSmarty.Compiler.Variable = JSmarty.Compiler.extend
(
	'__MODULE__',
	{
		toString : function()
		{
			var modf = this.toModifier();
			var name = 'v.' + this.getValue('name');

			if(name.indexOf('smarty') == 0){
				name = name.replace('smarty','self._');
			};

			return 'self.inModify('+ modf +','+ name +')';
		}
	}
);