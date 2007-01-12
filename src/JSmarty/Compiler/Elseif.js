JSmarty.Compiler.Elseif = JSmarty.Compiler.extend
(
	'If',
	{
		parse : function(c)
		{
			var exp = this.toExpression();
			this.sString = '}else if('+ exp +'){\n';
		},
		toExpression : function()
		{
			return '';
		}
	}
);
