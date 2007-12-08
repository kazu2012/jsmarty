JSmarty.Classes.HashMap = JSmarty.Classes.create(null);
JSmarty.Classes.HashMap.prototype =
{
	/** @private **/
	$keys : null,
	/** @private **/
	$values : null,
	/** @private **/
	$entries : null,
	/**
	 *
	 */
	init : function(){ this.clear(); },
	/**
	 *
	 * @params {String}
	 */
	get : function(key){
		return this.$values[this.$entries[key]];
	},
	/**
	 *
	 * @params {String} 
	 * @params {Object} 
	 */
	put : function(key, value)
	{
		var i = this.size();

		this.$keys[i] = key;
		this.$values[i] = value;
		this.$entries[key] = i;

		return value;
	},
	/**
	 *
	 * @params {String}
	 */
	containsKey : function(key){
		return (key in this.$keys);
	},
	/**
	 *
	 * @params {Object}
	 */
	containsValue : function(value)
	{
		var i, values = this.$values;
		for(i=values.length-1;0<=i;i--){
			if(value == values[i]){ return true; };
		};
		return false;
	},
	/**
	 *
	 * @params {String}
	 */
	remove : function(key)
	{
		var i = this.$entries[key];

		this.$keys.splice(i, 1);
		this.$values.splice(i, 1);

		this.doMapping();
	},
	/**
	 *
	 */
	clear : function()
	{
		this.$keys = [];
		this.$values = [];
		this.$entries = {};
	},
	/**
	 *
	 * @return {Number}
	 */
	size : function(){
		return this.$values.length;
	},
	/**
	 * Return 
	 * @return {JSmarty.Classes.HashMap}
	 */
	clone : function(){
		return new JSmarty.Classes.HashMap(this);
	},
	/**
	 *
	 * @return {Array}
	 */
	values : function(){
		return [].concat(this.$values);
	},
	/**
	 *
	 * @return {Array}
	 */
	entrySet : function(){
		return [].concat(this.$entries);
	},
	/**
	 *
	 * @param {Object} 
	 */
	putAll : function(target)
	{
		var key, length = this.size();
		var keys = this.$keys, values = this.$values;

		if(key in target)
		{
			if(!this.containsKey(key) && target.hasOwnProperty(key))
			{
				keys[length++] = key;
				values[length++] = target[key];
			};
		};

		this.doMapping();
	},
	/**
	 * 
	 * @return {Array}
	 */
	keySet : function(){
		return [].concat(this.$keys);
	},
	/**
	 * 
	 * @return {Boolean}
	 */
	isEmpty : function(){
		return (this.$values.length == 0);
	},
	/**
	 *
	 */
	doMapping : function()
	{
		var i, keys = this.$keys, entries = this.$entries = {};
		for(i=this.size()-1;0<=i;i--){ entries[keys[i]] = i; };
	}
};
