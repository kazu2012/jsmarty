JSmarty.Compiler.String = JSmarty.Classes.create(JSmarty.Compiler.Module,
{
	sString : '',
	parse : function(c)
	{
		if(this.sString == '')
		{
			this.sString = this.quote(this.getText());
			return;
		};

		if(this.sString != '')
		{
			var m = this.toModify();
			var s = this.escape(this.sString);
			this.sString = '$.$m('+ m +',' + s + ')';
			return;
		};

		this.sPrefix = '';
		this.sSuffix = '';

		return this;
	}
});