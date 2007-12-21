JSmarty.Classes.HashMap = JSmarty.Classes.create
({
	/** @private **/
	$K : null,
	/** @private **/
	$V : null,
	/** @private **/
	$E : null,
	/**
	 *
	 */
	init : function(){ this.clear(); },
	/**
	 *
	 * @params {String}
	 */
	get : function(key){
		return this.$V[this.$E[key]];
	},
	/**
	 *
	 * @params {String} 
	 * @params {Object} 
	 */
	put : function(key, value)
	{
		var i = this.size();

		this.$K[i] = key;
		this.$V[i] = value;
		this.$E[key] = i;

		return value;
	},
	/**
	 *
	 * @params {String}
	 */
	containsKey : function(key){
		return (key in this.$E);
	},
	/**
	 *
	 * @params {Object}
	 */
	containsValue : function(value)
	{
		var i, values = this.$V;
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
		var i = this.$E[key];

		this.$K.splice(i, 1);
		this.$V.splice(i, 1);

		this.doMapping();
	},
	/**
	 *
	 */
	clear : function()
	{
		this.$K = [];
		this.$V = [];
		this.$E = {};
	},
	/**
	 *
	 * @return {Number}
	 */
	size : function(){
		return this.$V.length;
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
		return [].concat(this.$V);
	},
	/**
	 *
	 * @return {Array}
	 */
	entrySet : function(){
		return [].concat(this.$E);
	},
	/**
	 *
	 * @param {Object} 
	 */
	putAll : function(target)
	{
		var key, length = this.size();
		var keys = this.$K, values = this.$V;

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
		return [].concat(this.$K);
	},
	/**
	 * 
	 * @return {Boolean}
	 */
	isEmpty : function(){
		return (this.$V.length == 0);
	},
	/**
	 *
	 */
	doMapping : function()
	{
		var i, keys = this.$K, entries = this.$E = {};
		for(i=this.size()-1;0<=i;i--){ entries[keys[i]] = i; };
	}
});
