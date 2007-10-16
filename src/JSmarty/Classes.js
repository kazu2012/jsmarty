JSmarty.Classes =
{
	create : function(s)
	{
		var f = function()
		{
			this.getSuper = function(){ return s; };
			this.initialize();
		};

		function c(){};
		c.prototype = (s) ? s.prototype : {};
		f.prototype = new c();
		f.extend = JSmarty.Classes.extend;

		return f;
	},
	extend : function(o)
	{
		var i, p = this.prototype || this;
		for(i in o){ p[i] = o[i]; };
	}
};
