JSmarty.History = function(){};
JSmarty.History.prototype =
{
	/** @private **/
	__list__ : {},
	/** @private **/
	__pool__ : [],
	/** @private **/
	pointer : null,
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
		var i = this.__list__[k];
		if(0 <= i){
			return this.__pool__[i];
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
			var l = self.length();
			this.next = function(){
				return self.__pool__[i];
			};
			this.hasNext = function(){
				(d == 'down') ? i-- : i++;
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
		return (0 <= this.__list__[k]) ? true : false;
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