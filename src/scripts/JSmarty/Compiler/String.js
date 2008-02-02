JSmarty.Compiler.String = JSmarty.Classes.create(JSmarty.Compiler.Module,
{
	sString : '',
	parse : function(c)
	{
		var m, s, str = this.sString;

		switch(true)
		{
			case (str == ''):
				this.sString = this.quote(this.getText());
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
