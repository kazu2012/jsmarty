JSmarty.Compiler.Module = JSmarty.Classes.create
({
	imp : -1,
	iap : -1,
	name : null,
	text : null,
	/** prefix **/
	sPrefix : '$b.append(',
	/** suffix **/
	sSuffix : ');',
	/** string **/
	sString : null,
	/** terminal **/
	bTerminal : true,
	/**
	 * parse function
	 */
	parse : function(c){
		return this;
	},
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
	init : function(text){
		this.text = text;
	},
	/**
	 * modifier function
	 */
	toModify : function()
	{
		if(this.imp < 0){ return '{}'; };

		var i, f, c = false;
		var v = JSmarty.Compiler.VALSYMBL;
		var s = this.text.slice(this.imp).split('');

		for(i=0,f=s.length;i<=f;i++)
		{
			switch(s[i])
			{
				case '$':
					s[i] = v;
					break;
				case '"':
				case "'":
					c = s[i++];
					while(s[i] != c && i <= f){ i++; };
					if(f + 1 < i){ this._error(); };
					if(s[i-1] == '\\'){ i--; };
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
	toParams : function()
	{
		if(this.iap < 0){ return '{}'; };

		var i, c, f;
		var v = JSmarty.Compiler.VALSYMBL;
		var s = this.text.slice(this.iap).split('');

		outerloop:
		for(i=0,f=s.length;i<=f;i++)
		{
			switch(s[i])
			{
				case '$':
					s[i] = v;
					break;
				case '=':
					s[i] = ':';
					break;
				case ' ':
				case '\t':
				case '\r':
				case '\n':
					s[i++] = ',';
					while(s[i] <= ' '){ s[i++] = ''; };
					break;
				case '"':
				case "'":
					c = s[i++];
					while(s[i] != c && i <= f){ ++i; };
					if(f < i){ new Error('template syntax error'); };
					if(s[i-1] == '\\'){ i--; };
					break;
				case '|':
					s.splice(i);
					this.imp = this.iap + i + 1;
					break outerloop;
			};
		};

		return '{' + s.join('') + '}';
	},
	toObject : function()
	{
		var p = /([^:,]+):('|"|)([^,]+)\2/g;
		return function(s)
		{
			var r, o = {};
			s = s.slice(1, s.length - 1)
			while((r = p.exec(s)) != null){
				o[r[1]] = r[3];
			};
			return o;
		};
	}(),
	/**
	 * get a text
	 * @return {String}
	 */
	getText : function(){
		return this.escape(this.text);
	},
	getName : function(){
		return this.quote(this.name);
	},
	/**
	 * quote a string of argument
	 * @param {String} s string
	 * @return {String} quoted string
	 */
	quote : function(s){
		return (s) ? "'" + s + "'" : '';
	},
	/**
	 * escape a string of argument
	 * @param {String} s string
	 * @return {String}
	 */
	escape : function(pat){
		return function(s){ return s.replace(pat, "\\'"); };
	}(/'/g),
	toString : function(){
		return this.sString;
	},
	set : function(key, value){
		this[key] = value;
	},
	get : function(key){
		return this[key];
	}
});
