JSmarty.Classes =
{
	extend : function(o)
	{
		return function(m)
		{
			for(var i in m){ o[i] = m[i]; };
			return o;
		}
	},
	create : function(s)
	{
		if(typeof(s) != 'function'){
			return function(){
				if(this.initialize){this.initialize(arguments);};
			};
		};

		var f = function()
		{
			this.getSuper = function(){ return s; };
			if(this.initialize){this.initialize(arguments);};
		};

		function c(){};
		c.prototype = s.prototype;
		f.prototype = new c();
		f.prototype.constructor = s;
		f.extend = JSmarty.Classes.extend(f.prototype);

		return f;
	}
};
