JSmarty.Logger =
{
	console : {},
	dictionary : {},
	invoke: function(method)
	{
		var m = this.dictionary[method] || method;
		return (this.console[m] || function(){});
	},
	forName : function()
	{
		if(JSmarty.Plugin['util.global']('console'))
		{
			if(!!console.firebug)
			{
				this.dictionary = {'die':'error'};
				JSmarty.Logger.console = console;
			};
		};
		this.forName = function(){};
	}
};
