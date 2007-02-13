JSmarty.Compiler.__MODULE__ = function(){};
JSmarty.Compiler.__MODULE__.prototype =
{
	imp : -1,
	iap : -1,
	name : null,
	text : null,
	/** prefix **/
	sPrefix : 'buf.append(',
	/** suffix **/
	sSuffix : ');\n',
	/** string **/
	sString : null,
	/** terminal **/
	bTerminal : true,
	/**
	 * parse function
	 */
	parse : function(c){},
	/**
	 * prefix function
	 */
	prefix : function(){
		return this.sPrefix;
	},
	/**
	 * suffix function
	 */
	suffix : function(){
		return this.sSuffix;
	},
	/**
	 * isTerminal function
	 */
	isTerminal : function(){
		return this.bTerminal;
	},
	/**
	 * setValue function
	 * setter for module.
	 * @param {String} k key
	 * @param {Object} v value
	 */
	setValue : function(k, v){
		if(k in this) this[k] = v;
	},
	quoteText : function(s){
		return (s) ? "'"+ s + "'" : '';
	},
	escapeText : function(str)
	{
		var s = str || '';
		if(-1 < s.indexOf("'")){
			s = s.split("'").join("\'");
		};
		return s;
	},
	/**
	 * getValue function
	 * getter for module.
	 * @param {String} k key
	 */
	getValue : function(k){
		return (k in this) ? this[k] : null;
	},
	/**
	 * modifier function
	 */
	toModifier : function()
	{
		if(this.imp < 0) return '{}';

		var i, f, c = false;
		var s = this.text.slice(this.imp).split('');

		for(i=0,f=s.length;i<=f;i++)
		{
			switch(s[i])
			{
				case '$':
					s[i] = '@@COMPILER::VARIABLE@@';
					break;
				case '"':
				case "'":
					c = s[i++];
					while(s[i] != c && i <= f) i++;
					if(f + 1 < i) throw new Error("");
					if(s[i-1] == '\\') i--;
					break;
				case ':':
					s[i] = (c) ? ',' : '":[,';
					c = true;
					break;
				case '|':
					s[i] = (c) ? '],"' : '":[],"';
					c = false;
					break;
			};
		};
		s[i] = (c) ? '' : '":[';

		return '{"'+ s.join('') +']}';
	},
	/**
	 * parameter function
	 */
	toParameter : function()
	{
		if(this.iap < 0) return '{}';

		var i, f, s = this.text.slice(this.iap).split('');

		outerloop:
		for(i=0,f=s.length;i<=f;i++)
		{
			switch(s[i])
			{
				case ' ':
				case '\t':
				case '\r':
				case '\n':
					s[i++] = ',';
					while(s[i] <= ' ') s[i++] = '';
					break;
				case '$':
					s[i] = '@@COMPILER::VARIABLE@@';
					break;
				case '=':
					s[i] = ':';
					break;
				case '"':
				case "'":
					c = s[i++];
					while(s[i] != c && i <= f) ++i;
					if(f < i) throw new Error("");
					if(s[i-1] == '\\') i--;
					break;
				case '|':
					s.splice(i);
					this.imp = this.iap + i + 1;
					break outerloop;
			};
		};

		return '{' + s.join('') + '}';
	},
	toString : function(){
		return this.sString;
	}
};
