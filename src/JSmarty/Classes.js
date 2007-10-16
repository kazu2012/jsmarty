JSmarty.Classes =
{
	create : function(s)
	{
		if(typeof(s) != 'function'){
			return function(){ this.initialize(); };
		};

		var f = function()
		{
			this.getSuper = function(){ return s; };
			this.initialize();
		};

		function c(){};
		c.prototype = s.prototype;
		f.prototype = new c();

		f.define = JSmarty.Classes.extend(f.prototype);
		return f;
	},
	extend : function(o)
	{
		return function(m)
		{
			for(var i in m){ o[i] = m[i]; };
			return o;
		}
	}
};
