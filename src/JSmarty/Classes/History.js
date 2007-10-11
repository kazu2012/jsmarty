JSmarty.Classes.History = function(){};
JSmarty.Classes.History.prototype =
{
	/** @private **/
	list : {},
	/** @private **/
	pool : [],
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
JSmarty.prototype.cache = new JSmarty.Classes.History();
