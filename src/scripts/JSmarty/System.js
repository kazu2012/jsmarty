/**
 * Provide interface of System.
 * @type JSmarty.System.Object
 */
JSmarty.System =
{
	modified : {},
	isWritable : false,

	getArgs : function()
	{
		JSmarty.Logger.info('');
		return null;
	},

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
		JSmarty.Logger = JSmarty.Classes('Logger');

		switch(name)
		{
			case 'ajaja':
			case 'mustang':
				load('./internals/system.'+ name +'.js');
				break;
			case 'gadget':
				this.path = String(System.Gadget.path).replace(/\\/g, '/') + '/';
				JSmarty.Browser.buildSystemObject();
				JSmarty.System.loadScript('system.gadget.js', JSmarty.Plugin.repos);
				break;
			case 'browser':
				this.path = ''; // temp
				JSmarty.Browser.buildSystemObject();
				break;
		};
	},

	timestamp : function(value){
		return (value) ? new Date(time).getTime() : new Date().getTime();
	}
};
