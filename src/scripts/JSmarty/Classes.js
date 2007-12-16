JSmarty.Classes = function(className){
	return new JSmarty.Classes[className];
};
JSmarty.Classes.extend = function(target)
{
	return function(object)
	{
		for(var i in object){ target[i] = object[i]; };
		return target;
	};
};
JSmarty.Classes.create = function(superclass)
{
	function Class()
	{
		if(typeof(this.init) == 'function'){
			this.init.apply(this, arguments);
		};
	};

	if(typeof(superclass) == 'function')
	{
		function c(){};
		c.prototype = superclass.prototype;
		Class.prototype = new c();
		Class.prototype.getSuper = function(){ return superclass; };
		Class.prototype.superclass = superclass.prototype;
	};

	Class.extend = JSmarty.Classes.extend(Class.prototype);
	return Class;
};
