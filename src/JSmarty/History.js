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
	iterator : function()
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
	apply : function(k, o, a)
	{
		var f = this.get(k);
		if(typeof(f) != 'function'){
			throw new Error(k +' is not Function.');
		};
		return f.apply(o, a);
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
	 * 
	 */
	length : function(){
		return this._pool_.length;
	}
};

JSmarty.Caching = new JSmarty.History();
JSmarty.Templatec = new JSmarty.History();