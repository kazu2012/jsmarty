JSmarty.Compiler.Elseif = JSmarty.Classes.create(JSmarty.Compiler.If,
{
	parse : function()
	{
		this.sString = '}else if('+ this.toExpression() +'){';
		return this;
	}
});
