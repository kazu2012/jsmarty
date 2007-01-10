JSmarty.Compiler.String = function(t){ this.text = t; };
JSmarty.Compiler.String.prototype =
{
	/** suffix **/
	__sfix__ : ');\n',
	/** prefix **/
	__pfix__ : 'buf.append(',
	parse : function(cx)
	{
		if(this.text)
		{
			this.escapeText();
			this.quoteText();
		}
		else
		{
			this.__sfix__ = '';
			this.__pfix__ = '';
		};
	},
	/**
	 * prefix function
	 */
	prefix : function(){
		return this.__pfix__;
	},
	/**
	 * suffix function
	 */
	suffix : function(){
		return  this.__sfix__;
	},
	/**
	 * getText function
	 */
	getText : function()
	{
		return this.text;
	},
	/**
	 * escapeText function
	 */
	escapeText : function()
	{
		var text = this.text;
		if(-1 < text.indexOf("'")) this.text = text.split("'").join("\\'");
	},
	/**
	 * quoteText function
	 */
	quoteText : function()
	{
		this.text = "'" + this.text + "'";
	},
	toString : function()
	{
		return this.getText();
	}
};