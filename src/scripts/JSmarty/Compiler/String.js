JSmarty.Compiler.String = JSmarty.Classes.create(JSmarty.Compiler.Module,
{
	sString : '',
	parse : function(c)
	{
		var m, s, text, str = this.sString;

		switch(true)
		{
			case (str == ''):
				text = this.getText();
				this.sString = this.quote(text);
				if(text == ''){
					this.sPrefix = this.sString = this.sSuffix = '';
				};
				return this;
			case (str != ''):
				m = this.toModify();
				s = this.escape(this.sString);
				this.sString = '$b.append('+ s + ').modify('+ m +');';
				this.sPrefix = this.sSuffix = '';
				return this;
		};
	}
});
