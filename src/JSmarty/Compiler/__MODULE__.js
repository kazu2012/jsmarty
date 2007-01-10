JSmarty.Compiler.__MODULE__ = function(){};
JSmarty.Compiler.__MODULE__.prototype =
{
	text : null,
	/** prefix **/
	sPrefix : 'buf.apend(',
	/** suffix **/
	sSuffix : ');\n',
	/** string **/
	sString : null,
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
	toString : function(){
		return this.sString;
	}
};
