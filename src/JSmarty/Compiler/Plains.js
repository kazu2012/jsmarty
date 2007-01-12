JSmarty.Compiler.Plains = JSmarty.Compiler.extend
(
	'__MODULE__',
	{
		sPrefix : '',
		sSuffix : '',
		sString : '',
		parse : function(c)
		{
			var text = this.text, flag = Boolean(text);
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
