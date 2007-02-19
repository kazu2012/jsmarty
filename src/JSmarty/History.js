JSmarty.History = function(){};
JSmarty.History.prototype =
{
	/** @private **/
	__list__ : {},
	/** @private **/
	__pool__ : [],
	/**
	 * setter for history
	 * @param {String} k key
	 * @param {Object} v value
	 * @return {Object} v value
	 */
	set : function(k, v)
	{
		var p = this.__pool__, i = p.length;
		p[i] = v;
		this.__list__[k] = i;
		return v;
	},
	/**
	 * getter for history
	 * @param {String} k
	 */
	get : function(k)
	{
		if(this.isExist(k)){
			return this.__pool__[this.__list__[k]];
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
			var p = self.length();
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
	call : function(k, o, a)
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
	},
	/**
	 * 
	 */
	length : function(){
		return this.__pool__.length;
	}
};

JSmarty.Caching = new JSmarty.History();
JSmarty.Templatec = new JSmarty.History();