JSmarty.Compiler.Context = function(){};
JSmarty.Compiler.Context.prototype =
{
	/** TagStack **/
	__tags__ : [],
	/** Nonterminals **/
	__ntml__ : {},
	/** Primitives **/
	__prim__ : { literal : 1, javascript : 1 },
	/** index of plain **/
	iPlain : -1,
	/** left_delimiter **/
	ldelim : '{',
	/** right_delimiter **/
	rdelim : '}',
	/**
	 * setTree function
	 * @param {String}  n name
	 * @param {Boolean} f terminal
	 */
	setTree : function(n, f)
	{
		var i = this.iPlain;
		var prim = this.__prim__, tags = this.__tags__;

		if(n in this.__ntml__)
		{
			if(f)
			{
				if(n != tags.pop()) throw new Error("");
				if(n in prim && i == tags.length) this.iPlain = -1;
			}
			else
			{
				tags.push(n);
				if(i == -1 && n in prim) this.iPlain = tags.length - 1;
			};
		};

		return n;
	},
	/**
	 * isPlain function
	 * @return Boolean
	 */
	isPlain : function(){
		return (0 <= this.iPlain);
	},
	/**
	 * addNonterminal function
	 * add the nonterminal module to this context.
	 * @param {String} n name
	 */
	addNonterminal : function(n)
	{
		this.__ntml__[n] = true;
	},
	typeOf : function()
	{
		var P = JSmarty.Plugin;
		return function(n)
		{
			if(this.isPlain()) return 'plain';
			if(n in this.__ntml__) return 'block';
		//	if(P.addPlugin('function.'+ n)) return 'function';
		//	if(P.addPlugin('compiler.'+ n)) return 'compiler';
			return 'function';
		}
	}(),
	/**
	 * getValue function
	 * getter for Context
	 * @param {String} k key in context
	 */
	getValue : function(k){
		if(k in this) return this[k];
	},
	/**
	 * setValue function
	 * setter for Context
	 * @param {String} k key in context
	 * @param {Object} v value
	 */
	setValue : function(k, v){
		if(k in this) this[k] = v;
	}
};
