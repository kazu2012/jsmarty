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
	var f = function()
	{
		if(this.initialize){ this.initialize.apply(this, arguments); };
	};

	if(typeof(superclass) == 'function')
	{
		f.prototype = JSmarty.Plugin['core.clone'](superclass.prototype);
		f.prototype.getSuper = function(){ return superclass; };
		f.prototype.superclass = superclass.prototype;
		f.extend = JSmarty.Classes.extend(f.prototype);
	};

	return f;
};
