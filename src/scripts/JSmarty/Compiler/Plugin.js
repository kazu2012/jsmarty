JSmarty.Compiler.Plugin = JSmarty.Classes.create(JSmarty.Compiler.Module,
{
	sPrefix : '',
	sSuffix : '',
	sString : '',
	parse : function()
	{
		this.sString = this.getText();
		return this;
	}
});
