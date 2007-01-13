JSmarty.Compiler.String = JSmarty.Compiler.extend
(
	'__MODULE__',
	{
		sString : '',
		parse : function(c)
		{
			if(this.sString == '')
			{
				this.sString = this.quoteText(this.escapeText());
				return;
			};

			if(this.sString != '')
			{
				var str = this.escapeText(this.sString);
				var mod = this.toModifier();
				this.sString = 'self.inModify('+ mod +',' + str + ')';
				return;
			};

			this.sPrefix = '';
			this.sSuffix = '';
		},
		quoteText : function(s)
		{
			if(typeof(s) == 'undefined') s = this.text;
			return "'" + s + "'";
		},
		escapeText : function(s)
		{
			if(typeof(s) == 'undefined') s = this.text;
			if(0 <= s.indexOf("'")) s = s.split("'").join("\\'");
			return s;
		}
	}
);
