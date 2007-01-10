JSmarty.Compiler.__MODULE__ = function(){};
JSmarty.Compiler.__MODULE__.prototype =
{
	/** prefix **/
	sPrefix : 'buf.apend(',
	/** suffix **/
	sSuffix : ');\n',
	parse : function(cx){},
	prefix : function(){
		return this.sPrefix;
	},
	suffix : function(){
		return this.sSuffix;
	},
	toString : function(){
		return this.text;
	}
};
