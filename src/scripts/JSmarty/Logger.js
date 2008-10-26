/**
 * @namespace Logging API
 */
JSmarty.Logger =
{
	dict : {},
	console : {},
	lookup : function(method){
		return (this.dict[method] || method);
	},
	invoke: function(method){
		return (this.console[this.lookup(method)] || JSmarty.$function);
	},
	/**
	 * setup for LoggerObject
	 * @return {void}
	 */
	forName : function()
	{
		this.forName = JSmarty.$function;
	}
};
