JSmarty.Classes.HashMap = JSmarty.Class.create(null);
JSmarty.Classes.HashMap.prototype =
{
	$pool : null,
	$keys : null,
	$maps : null,
	initialize : function(){
		this.clear();
	},
	get : function(key){
		return this.$pool[this.$maps[key]];
	},
	put : function(key, value)
	{
		var size = this.size();

		this.$maps[key] = size;
		this.$pool[size] = value;
		this.$keys[size] = key;

		return value;
	},
	containsKey : function(key){
		return (key in this.$maps);
	},
	containsValue : function(value)
	{
		var i, f, values = this.$pool;
		for(i=0,f=values.length;i<f;i++){
			if(value == values[i]){ return true; };
		};
		return false;
	},
	remove : function(key)
	{
		var o, i = this.$maps[key]
		this.$pool.splice(i, 1);
		this.$keys.splice(i, 1);
		key = this.$keys, o = this.$maps;
		for(i=this.size()-1;0<=i;i--){ o[key[i]] = i; };
	},
	clear : function()
	{
		this.$maps = {};
		this.$pool = [];
		this.$keys = [];
	},
	clone : function(){
		return JSmarty.Plugin.get('core.clone')(this);
	},
	values : function(){
		return [].concat(this.$pool);
	},
	size : function(){
		return this.$pool.length;
	}
};
