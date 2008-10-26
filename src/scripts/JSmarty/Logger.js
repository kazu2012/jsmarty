/**
 * @namespace Logging API
 */
JSmarty.Logger =
{
	/**
	 * @param {String} level 
	 * @return {Function}
	 * @sample
	 * JSmarty.Logger.invoke('info', 'Hello World!!');
	 */
	invoke : function(verbose)
	{
		this.forName();
		return this.invoke(verbose);
	},
	/**
	 * setup for LoggerObject
	 * @return {void}
	 */
	forName : function()
	{
		var mapping = {};
		var console = JSmarty.Plugin['util.global']().console || {};

		switch(true)
		{
			// firefox with firebug
			case (!!console.firebug):
				mapping = {info: "log"};
				break;
			default:
				break;
		};

		this.invoke = function(verbose){
			return (console[mapping[verbose] || verbose] || JSmarty.$function)
		};

		this.forName = JSmarty.$function;
	}
};
