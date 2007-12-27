JSmarty.System =
{
	modified : {},
	buildPath : function(p, d)
	{
		var i, a = [].concat(d);
		for(i=a.length-1;0<=i;i--){
			a[i] = a[i] + '/' + p;
		};
		return a;
	},
	getName : function()
	{
		var global = JSmarty.Plugin['util.global'];
		if(global('System', 'Core')){ return 'ajaja'; };
		if(global('window', 'System')){ return 'gadget'; };
		if(global('window', 'document')){ return 'browser'; };
	},
	forName : function(name)
	{
		switch(name)
		{
			case 'ajaja':
			case 'mustang':
				load('./internals/system.'+ name +'.js');
				break;
			case 'gadget':
				break;
			case 'browser':
				JSmarty.Navigator.setEnviroment();
				break;
		};
	},

	timestamp : function(time){
		return (time) ? new Date(time).getTime() : new Date().getTime();
	}
};

JSmarty.System.forName(JSmarty.System.getName());
