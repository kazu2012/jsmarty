JSmarty.Logger =
{
	console : null,
	invokeMethod : function(method){
		return (this.console[method] || function(){})
	},
	forName : function()
	{
		if(JSmarty.Plugin['util.global']('console')){
			if(!!console.firebug){ JSmarty.Logger.console = console; };
		};
		this.forName = function(){};
	}
};
