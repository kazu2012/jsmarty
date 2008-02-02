JSmarty.Classes =
{
	mixin : function(base, dest)
	{
		for(var i in dest){ base[i] = dest[i]; };
		if(dest.hasOwnProperty('valueOf')){
			base.valueOf = dest.valueOf;
		};
		if(dest.hasOwnProperty('toString')){
			base.toString = dest.toString;
		};
		return base;
	},
	extend : function(Class, $super)
	{
		function f(){};
		f.prototype = ($super.prototype || $super);
		Class.prototype = new f();
		Class.prototype.getSuper = function(method){
			return (method) ? $super.prototype[method] : $super;
		};
		return this;
	},
	create : function($super, field)
	{
		function Class(){ this.init.apply(this, arguments); };

		switch(arguments.length)
		{
			case 1:
				this.mixin(Class.prototype, $super);
				break;
			case 2:
				this.extend(Class, $super).mixin(Class.prototype, field);
				break;
		};

		if(!Class.prototype.init){
			Class.prototype.init = JSmarty.$function;
		};

		return Class;
	}
};
