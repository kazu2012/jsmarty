JSmarty.Compiler.Variable = JSmarty.Compiler.extend
(
	'__MODULE__',
	{
		parse : function(c)
		{
			var modf = this.toModifier();
			var name = this.getValue('name');

			if(name.indexOf('smarty') == 0){
				name = name.replace('smarty','self._');
			}else{
				name = 'v.' + name;
			};

			this.sString = 'self.inModify('+ modf +','+ name +')';
		}
	}
);
