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
		var idx = -1, len = 0, buf = [];

		function toString(s){ return buf.join(s || ''); };

		this.append = function(s)
		{
			if(s)
			{
				len += s.length;
				buf[++idx] = s;
			};
			return this;
		};

		this.getProperty = function(name)
		{
			switch(name)
			{
				case 'length': return len;
			};
		};

		this.valueOf = this.toString = toString;
	}
};

JSmarty.Utility.StringBuilder.prototype =
{
	length : function()
	{
		return this.getProperty('length');
	}
};