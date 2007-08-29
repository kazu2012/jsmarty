/**
 * Provide interface of System.
 * @type JSmarty.System.Object
 */
JSmarty.System =
{
	path : null,
	isWritable : false,
	getArgs : function(){
		return null;
	},
	getSelfPath : function(){
		return '.';
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
				var i, r, p = String(System.Gadget.path).replace(/\\/g, '/');
				JSmarty.Browser.buildSystemObject();
				r = JSmarty.Plugin.repos;
				for(i=r.length-1;0<=i;i--){
					r[i] = (r[i] == '.') ? p : p + '/' + r[i];
				};
				eval(JSmarty.System.read('system.gadget.js', r));
				break;
			default:
				JSmarty.Browser.buildSystemObject();
				break;
		};
	}
};