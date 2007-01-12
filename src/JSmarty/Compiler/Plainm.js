JSmarty.Compiler.Plainm = JSmarty.Compiler.extend
(
	'__MODULE__',
	{
		parse : function(c)
		{
			var text = this.text, flag = Boolean(text);
			this.sPrefix = c.getValue('ldelim');
			this.sSuffix = c.getValue('rdelim');

			if(flag)
			{
				if(0 <= text.indexOf("'")){
					text = text.split("'").join("\\'");
				};
				this.sString = text;
			};
		}
	}
);
