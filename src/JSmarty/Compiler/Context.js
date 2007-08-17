JSmarty.Compiler.Context = function(){};
JSmarty.Compiler.Context.prototype =
{
	/** TagStack **/
	__tags__ : [],
	/** folded block element **/
	__blck__ : {},
	/** folded plain element **/
	__plan__ : { literal : true, strip : true, javascript : true },
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
		var tags = this.__tags__;
		var plain = this.__plan__;

		if(n in this.__blck__)
		{
			if(f)
			{
				if(n != tags.pop()) throw new Error("");
				if(n in plain && i == tags.length) this.iPlain = -1;
			}
			else
			{
				tags.push(n);
				if(n in plain && i == -1) this.iPlain = tags.length - 1;
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
	 * addElement function
	 * add the type of element to this context.
	 * @param {String} t type
	 * @param {String} n name
	 */
	addElement : function(t, n)
	{
		switch(t)
		{
			case 'block':
				this.__blck__[n] = true;
				break;
			case 'plain':
				this.__plan__[n] = true;
				break;
		};
	},
	typeOf : function()
	{
		var P = JSmarty.Plugin;
		return function(n)
		{
			if(n in this.__blck__) return 'block';
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
