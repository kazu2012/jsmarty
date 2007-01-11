JSmarty.Compiler.String = JSmarty.Compiler.extend
(
	'__MODULE__',
	{
		parse : function(c)
		{
			var text = this.text, flag = Boolean(text);

			if(flag)
			{
				if(0 <= text.indexOf("'")){
					text = text.split("'").join("\\'");
				};
				this.sString = "'" + text + "'";
			}
			else
			{
				this.sPrefix = '';
				this.sSuffix = '';
				this.sString = '';
			};
		}
	}
);
