JSmarty.Utility =
{
	factory : function(o)
	{
		function f(){};
		f.prototype = o;
		return new f;
	},
	flatten : function(o)
	{
		if(typeof(o) == 'string') o = [o];
		return o;
	},
	arraycopy : function(a)
	{
		return (a.length == 1) ? [a[0]] : Array.apply(null, a);
	},
	objectcopy : function(o)
	{
		var i, r = {};
		for(i in o) r[i] = o[i];
		return r;
	}
};