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
	StringBuilder : function()
	{
		var k = -1, buf = [];

		this.append = function()
		{
			for(var i=0,f=arguments.length;i<f;i++)
			{
				this.length += arguments[i].length;
				buf[++k] = arguments[i];
			};
		};

		this.toString = function(s){
			return buf.join(s || '');
		};
	}
};

JSmarty.Utility.StringBuilder.prototype = { length : 0 };