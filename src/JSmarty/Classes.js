JSmarty.Classes = function(className){
	return new JSmarty.Classes[className]();
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
	if(typeof(superclass) != 'function')
	{
		return function()
		{
			if(this.initialize)
			{
				this.initialize(arguments);
				delete(this.initialize);
			};
		};
	};

	var f = function()
	{
		this.getSuper = function(){ return superclass; };
		if(this.initialize)
		{
			this.initialize(arguments);
			delete(this.initialize);
		};
	};

	function c(){};
	c.prototype = superclass.prototype;
	f.prototype = new c();
	f.prototype.constructor = superclass;
	f.extend = JSmarty.Classes.extend(f.prototype);

	return f;
};
