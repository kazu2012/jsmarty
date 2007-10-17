JSmarty.Classes.History = JSmarty.Classes.create(null);
JSmarty.Classes.History.prototype =
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
	initialize : function()
	{
		this.$maps = {};
		this.$pool = [];
		this.$keys = [];
	},
	set : function(k, v)
	{
		var i = this.length();
		this.$pool[i] = v;
		this.$keys[i] = k;
		this.$maps[k] = i;
		return v;
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
	clearAll : function(){
		this.initilize();
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
	length : function(){
		return this.$pool.length;
	},
	isExist : function(k){
		return (k in this.$maps);
	}
};
