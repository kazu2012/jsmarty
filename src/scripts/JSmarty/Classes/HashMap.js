JSmarty.Classes.HashMap = JSmarty.Classes.create(null);
JSmarty.Classes.HashMap.prototype =
{
	/** @private **/
	$pool : null,
	/** @private **/
	$keys : null,
	/** @private **/
	$maps : null,
	initialize : function(){
		this.clear();
	},
	get : function(key){
		return this.$pool[this.$maps[key]];
	},
	put : function(key, value)
	{
		var i = this.size();

		this.$pool[i] = value;
		this.$keys[i] = key;
		this.$maps[key] = i;

		return value;
	},
	containsKey : function(key){
		return (key in this.$maps);
	},
	containsValue : function(value)
	{
		var i, values = this.$pool;
		for(i=values.length-1;0<=i;i--){
			if(value == values[i]){ return true; };
		};
		return false;
	},
	remove : function(key)
	{
		var i, map, n = this.$maps[key];

		this.$pool.splice(n, 1);
		this.$keys.splice(n, 1);
		key = this.$keys, map = this.$maps = {};
		for(i=this.size()-1;0<=i;i--){ map[key[i]] = i; };
	},
	clear : function(){
		this.$maps = {}, this.$pool = [], this.$keys = [];
	},
	clone : function(){
		return JSmarty.Plugin.get('core.clone')(this);
	},
	values : function(){
		return [].concat(this.$pool);
	},
	size : function(){
		return this.$pool.length;
	},
	entrySet : function()
	{
	},
	putAll : function()
	{
	},
	keySet : function()
	{
	},
	isEmpty : function()
	{
	}
};
