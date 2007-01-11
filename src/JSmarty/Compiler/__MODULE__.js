JSmarty.Compiler.__MODULE__ = function(){};
JSmarty.Compiler.__MODULE__.prototype =
{
	text : null,
	/** prefix **/
	sPrefix : 'buf.append(',
	/** suffix **/
	sSuffix : ');\n',
	/** string **/
	sString : null,
	/** terminal **/
	bTerminal : true,
	/**
	 * parse function
	 */
	parse : function(){},
	/**
	 * prefix function
	 */
	prefix : function(){
		return this.sPrefix;
	},
	/**
	 * suffix function
	 */
	suffix : function(){
		return this.sSuffix;
	},
	/**
	 * isTerminal function
	 */
	isTerminal : function(){
		return this.bTerminal;
	},
	/**
	 * setValue function
	 * setter for module.
	 * @param {String} k key
	 * @param {Object} v value
	 */
	setValue : function(k, v){
		if(k in this) this[k] = v;
	},
	/**
	 * getValue function
	 * getter for module.
	 * @param {String} k key
	 */
	getValue : function(k){
		return (k in this) ? this[k] : null;
	},
	toString : function(){
		return this.sString;
	}
};
