JSmarty.Classes = function(className){
	return new JSmarty.Classes[className];
};

JSmarty.Classes.extend = function(Class, $super)
{
	function f(){};
	f.prototype = ($super.prototype || $super);
	Class.prototype = new f();
	Class.prototype.getSuper = function(method){
		return (method) ? $super.prototype[method] : $super;
	};
	return this;
};

JSmarty.Classes.mixin = function(base, dest)
{
	var i, target = base.prototype || base;
	dest = dest.prototype || dest;
	for(i in dest){ target[i] = dest[i]; };
	if(dest.hasOwnProperty('valueOf')){
		target.valueOf = dest.valueOf;
	};
	if(dest.hasOwnProperty('toString')){
		target.toString = dest.toString;
	};
	return base;
};

JSmarty.Classes.create = function($super, field)
{
	function Class(){ this.init.apply(this, arguments); };

	switch(arguments.length)
	{
		case 1:
			this.mixin(Class, $super);
			break;
		case 2:
			this.extend(Class, $super).mixin(Class, field);
			break;
	};

	if(!Class.prototype.init){
		Class.prototype.init = JSmarty.emptyFunction;
	};

	return Class;
};
