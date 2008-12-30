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

		this.sString = 'if('+ this.toNativeCode() +'){';
	},
	toNativeCode : function()
	{
		var exp, buf = new JSmarty.Classes.Buffer();
		var iap = this.get('iap'), op = this.OPERATORS;
		var i, f, c, s = this.text.slice(this.iap).split('');

		outerloopif:
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
					if(f + 1 < i){};
					if(s[i-1] == '\\'){ i--; };
					break;
				case ' ':
					c = '';
					while(s[++i] != ' ' && i < f){
						c += s[i], s[i] = '';
					};
					if(f + 1 < i){};
					s[i] = (op[c] || c) + ' ';
					break;
				case '|':
					s.splice(i);
					break outerloopif;
			};
		};

		exp = s.join('').replace(/(\w+)\(([^)]*)\)/g, "$P('php.$1')($2)");

		return buf.append('(function(){ try{ return (', exp ,'); }catch(e){ return false; }; })()').toString();
	}
});
