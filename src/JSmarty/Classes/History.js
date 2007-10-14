JSmarty.Classes.History = function(){
	this.list = {}, this.pool = [];
};
JSmarty.Classes.History.prototype =
{
	/** @private **/
	list : null,
	/** @private **/
	pool : null,
	/**
	 * setter for history
	 * @param {String} k key
	 * @param {Object} v value
	 * @return {Object} v value
	 */
	set : function(k, v)
	{
		var p = this.pool;
		var i = p.length;
		p[i] = v;
		this.list[k] = i;
		return v;
	},
	/**
	 * getter for history
	 * @param {String} k
	 */
	get : function(k)
	{
		if(this.isExist(k)){
			return this.pool[this.list[k]];
		};
		return null;
	},
	/**
	 *
	 */
	iterator : function()
	{
		var p = this.pool;
		var l, i = l = p.length - 1;
		return new function(){
			this.next = function(){
				return p[i++];
			};
			this.prev = function(){
				return p[i--];
			};
			this.hasPrev = function(){
				return (i != 0);
			};
			this.hasNext = function(){
				return (i != l);
			};
		}
	},
	/**
	 * did key exist?
	 * @param {String} k key
	 * @return {Boolean}
	 */
	isExist : function(k){
		return (k in this.list);
	},
	/**
	 * wrapper for Array#length
	 */
	length : function(){
		return this.pool.length;
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
	clearAll : function(){
		this.list = {}, this.pool = [];
	}
};
