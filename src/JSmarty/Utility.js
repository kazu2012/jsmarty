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
	},
	Buffer : function()
	{
		var k = -1, buf = [];

		this.append = function()
		{
			for(var i=0,f=arguments.length;i<f;i++)
			{
				if(argumtens[i])
				{
					this.length += argumtens[i].length;
					buf[++k] = argumtens[i];
				};
			};
		};

		this.toString = function(s){
			return buf.join(s || '');
		};
	},
	Histroy : function(){};
};

JSmarty.Utility.Buffer.prototype.length = 0;

JSmarty.Utility.History.prototype =
{
	
};

// JSmarty.Caching = new JSmarty.Utility.History();
// JSmarty.Template = new JSmarty.Utility.History();