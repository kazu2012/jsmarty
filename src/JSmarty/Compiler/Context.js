JSmarty.Compiler.Context = function(){};
JSmarty.Compiler.Context.prototype =
{
	/** TagStack **/
	__tags__ : [],
	/** Nonterminals **/
	__ntml__ : {},
	/** Primitives **/
	__prim__ : { literal : 1, javascript : 1 },
	/** suffix **/
	__sfix__ : 'buf.append(',
	/** prefix **/
	__pfix__ : ');\n',
	/** index of primitive **/
	iPrim : -1,
	/** left_delimiter **/
	ldelim : '{',
	/** right_delimiter **/
	rdelim : '}',
	/**
	 * setTree function
	 * @param {String}  n name
	 * @param {Boolean} t terminal
	 */
	setTree : function(n, t)
	{
		var i = this.iPrim;
		var prim = this.__prim__, tags = this.__tags__;

		if(n in this.__ntml__)
		{
			if(t)
			{
				if(n != tags.pop()) throw new Error("");
				if(n in prim && i == tags.length) this.iPrim = -1;
			}
			else
			{
				tags.push(n);
				if(i == -1 && n in prim) this.iPrim = tags.length - 1;
			};
		};
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
		var Plugin = JSmarty.Plugin;
		return function(n)
		{
			if(-1 < this.iPrim) return 'primitive';
			if(n in this.__ntml__) return 'block';
		//	if(Plugin.addPlugin('function.'+ n)) return 'function';
		//	if(Plugin.addPlugin('compiler.'+ n)) return 'compiler';
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