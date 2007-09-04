/**
 * Provide interface of System.
 * @type JSmarty.System.Object
 */
JSmarty.System =
{
	internals : null,
	isWritable : false,
	getArgs : function(){ return null; },
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
		var g = JSmarty.GLOBALS;
		if(g.System && g.Core         ){ return 'ajaja'; };
		if(g.System && g.System.Gadget){ return 'gadget'; };
		if(g.window && g.document     ){ return 'browser'; };
	},
	forName : function(n)
	{
		switch(n)
		{
			case 'ajaja':
				load('./internals/system.ajaja.js');
				break;
			case 'mustang':
				load('./internals/system.mustang.js');
				break;
			case 'gadget':
				JSmarty.Browser.buildSystemObject();
				eval(this.read('system.gadget.js', this.internals));
				break;
			default:
				JSmarty.Browser.buildSystemObject();
				break;
		};
	}
};