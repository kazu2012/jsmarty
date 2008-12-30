JSmarty.Compiler.Elseif = JSmarty.Classes.create(JSmarty.Compiler.If,
{
	parse : function()
	{
		this.sString = '}else if('+ this.toNativeCode() +'){';
		return this;
	}
});
