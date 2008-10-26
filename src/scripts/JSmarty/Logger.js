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
		if(JSmarty.Plugin['util.global']('console'))
		{
			if(!!console.firebug)
			{
				this.dict = {'die':'error'};
				this.invoke = function(method)
				{
					method = this.lookup(method);
					return function(){ console[method].apply(console, arguments); };
				};
			};
		};
		this.forName = JSmarty.$function;
	}
};
