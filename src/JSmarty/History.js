JSmarty.History = function(){};
JSmarty.History.prototype =
{
	/** @private **/
	_list_ : {},
	/** @private **/
	_pool_ : [],
	/**
	 * setter for history
	 * @param {String} k key
	 * @param {Object} v value
	 * @return {Object} v value
	 */
	set : function(k, v)
	{
		var p = this._pool_;
		var i = p.length;
		p[i] = v;
		this._list_[k] = i;
		return v;
	},
	/**
	 * getter for history
	 * @param {String} k
	 */
	get : function(k)
	{
		if(this.isExist(k)){
			return this._pool_[this._list_[k]];
		};
		return null;
	},
	/**
	 *
	 */
	iterator : function(d)
	{
		var self = this;
		return new function(){
			this.next = function(){
			};
			this.prev = function(){
			};
			this.hasPrev = function(){
			};
			this.hasNext = function(){
			};
		}
	},
	/**
	 * wrapper for Function#apply
	 */
	apply : function(k, o, a)
	{
		var f = this.get(k);
		if(typeof(f) != 'function'){
			throw new Error(k +' is not Function.');
		};
		switch(arguments.length)
		{
			case 1: return f.apply();
			case 2: return f.apply(o);
			case 3: return f.apply(o, a);
		};
	},
	/**
	 * did key exist?
	 * @param {String} k key
	 * @return {Boolean}
	 */
	isExist : function(k){
		return (k in this._list_);
	},
	/**
	 * wrapper for Array#length
	 */
	length : function(){
		return this._pool_.length;
	},
	/**
	 *
	 *
	 */
	clear : function(k)
	{
		
	},
	/**
	 * clear the all histories
	 */
	clearAll : function()
	{
		this._list_ = {};
		this._pool_ = [];
	}
};

JSmarty.Templatec = new JSmarty.History();