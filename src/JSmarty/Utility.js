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
		var i, s = {};
		for(i in o) o[i] = s[i];
		return s;
	}
};