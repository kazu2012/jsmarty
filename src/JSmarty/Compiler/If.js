JSmarty.Compiler.If = JSmarty.Compiler.extend
(
	'__MODULE__',
	{
		sSuffix : '',
		sPrefix : '',
		OPERATORS :
		{
			eq : '==', ne : '!=', neq: '!=', gt : '>' ,
			lt : '<' , ge : '>=', gte: '>=', le : '<=',
			lte: '<=', not: '!' , and: '&&', or : '||',
			mod: '%'
		},
		parse : function(c)
		{
			if(this.isTerminal())
			{
				this.sString = '}\n';
			}
			else
			{
				var exp = this.toExpression();
				this.sString = 'if('+ exp +'){\n';
			};
		},
		toExpression : function()
		{
			var iap = this.getValue('iap'), op = this.OPERATORS;
			var i, f, c, s = this.text.slice(this.iap).split('');

			outerloop:
			for(i=0,f=s.length;i<=f;i++)
			{
				switch(s[i])
				{
					case '$':
						s[i++] = '@@COMPILER::VARIABLE@@';
						break;
					case '"':
					case "'":
						c = s[i++];
						while(s[i] != c && i <= f) ++i;
						if(f + 1 < i) throw new Error("");
						if(s[i-1] == '\\') i--;
						break;
					case ' ':
						c = '';
						while(s[++i] != ' ' && i <= f) c += s[i], s[i] = '';
						if(f + 1 < i) throw new Error("");
						s[i] = ((op[c]) ? op[c] : c) + ' ';
						break;
					case '|':
						s.splice(i);
						break outerloop;
				};
			};

			return s.join('');
		}
	}
);
