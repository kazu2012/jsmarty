JSmarty.Compiler.If = JSmarty.Classes.create(JSmarty.Compiler.Module,
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
			return;
		};

		this.sString = 'if('+ this.toExpression() +'){';
	},
	toExpression : function()
	{
		var buf = new JSmarty.Classes.Buffer();
		var iap = this.get('iap'), op = this.OPERATORS;
		var i, f, c, s = this.text.slice(this.iap).split('');

		outerloop:
		for(i=0,f=s.length;i<=f;i++)
		{
			switch(s[i])
			{
				case '$':
					s[i++] = JSmarty.Compiler.VALSYMBL;
					break;
				case '"':
				case "'":
					c = s[i++];
					while(s[i] != c && i <= f){ ++i; };
					if(f + 1 < i){ this._error(); };
					if(s[i-1] == '\\'){ i--; };
					break;
				case ' ':
					c = '';
					while(s[++i] != ' ' && i <= f){
						c += s[i], s[i] = '';
					};
					if(f + 1 < i){ this._error(); };
					s[i] = ((op[c]) ? op[c] : c) + ' ';
					break;
				case '|':
					s.splice(i);
					break outerloop;
			};
		};

		return buf.append('(function(){ try{ return (', s.join('') ,'); }catch(e){ return false; }; })()').toString();
	}
});
