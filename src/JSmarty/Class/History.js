JSmarty.Class.History = JSmarty.Class.create(null);
JSmarty.Class.History.prototype =
{
	/** @private **/
	$pool : null,
	/** @private **/
	$keys : null,
	/** @private **/
	$maps : null,
	/**
	 * initizlise for History
	 */
	initialize : function(){
		this.clearAll();
	},
	/**
	 * setter for History
	 * @param {String} key
	 * @param {Object} val 
	 */
	set : function(key, val)
	{
		var len = this.length();

		switch(typeof(val))
		{
			case 'string' :
				val = new String(val); break;
			case 'number': 
				val = new Number(val); break;
			case 'boolean':
				val = new Boolean(val); break;
		};

		if(!val.timestamp){
			val.timestamp = new Date().getTime();
		};

		this.$pool[len] = val;
		this.$keys[len] = key;
		this.$maps[key] = len;

		return val;
	},
	get : function(k){
		return this.$pool[this.$maps[k]];
	},
	clear : function(k)
	{
		var o, i = this.$maps[k]
		this.$pool.splice(i, 1);
		this.$keys.splice(i, 1);
		k = this.$keys, o = this.$maps;
		for(i=this.length()-1;0<=i;i--){ o[k[i]] = i; };
	},
	clearAll : function()
	{
		this.$maps = {};
		this.$pool = [];
		this.$keys = [];
	},
	iterator : function()
	{
		return new function()
		{
			this.next = function(){
			};
			this.prev = function(){
			};
			this.hasNext = function(){
			};
			this.hasPrev = function(){
			};
		};
	},
	update : function(lifetime){},
	length : function(){
		return this.$pool.length;
	},
	isExist : function(k){
		return (k in this.$maps);
	}
};
