JSmarty.Compiler.Context = function(){};
JSmarty.Compiler.Context.prototype =
{
	/** TagStack **/
	_tags : [],
	/** folded block element **/
	_blocks : {},
	/** folded plain element **/
	_plains :
	{
		strip : true,
		literal : true,
		javascript : true
	},
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
		var t = this._tags, p = this._plains;

		if(n in this._blocks)
		{
			if(f)
			{
				if(n != t.pop()){
					JSmarty.Error.raise("Syntax error");
				};
				if(n in p && this.iPlain == t.length){
					this.iPlain = -1;
				};
			}
			else
			{
				t.push(n);
				if(n in p && this.iPlain == -1){
					this.iPlain = t.length - 1;
				};
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
				this._blocks[n] = true;
				break;
			case 'plain':
				this._plains[n] = true;
				break;
		};
	},
	typeOf : function()
	{
		var P = JSmarty.Plugin;
		return function(n)
		{
			if(n in this._blocks) return 'block';
		//	if(P.addPlugin('function.'+ n)) return 'function';
		//	if(P.addPlugin('compiler.'+ n)) return 'compiler';
			return 'function';
		}
	}(),
	/**
	 * getter for Context
	 * @param {String} k key in context
	 */
	get : function(k){
		return (k in this) ? this[k] : null;
	},
	/**
	 * setter for Context
	 * @param {String} k key in context
	 * @param {Object} v value
	 */
	set : function(k, v){
		if(k in this){ this[k] = v; };
	}
};
