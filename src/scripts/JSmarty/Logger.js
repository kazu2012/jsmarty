JSmarty.Logger =
{
	dict : {},
	console : {},
	lookup : function(method){
		return (this.dict[method] || method);
	},
	invoke: function(method){
		return (this.console[this.lookup(method)] || JSmarty.emptyFunction);
	},
	forName : function()
	{
		if(JSmarty.Plugin['util.global']('console'))
		{
			if(!!console.firebug)
			{
				this.dict = {'die':'error'};
				JSmarty.Logger.console = console;
			};
		};
		this.forName = function(){};
	}
};
