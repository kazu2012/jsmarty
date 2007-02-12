JSmarty.Utility =
{
	clone : function(o)
	{
		function f(){};
		f.prototype = o;
		return new f();
	},
	copyArray : function(){
		return Array.prototype.slice.call(arguments);
	},
	copyObject : function(o)
	{
		var i, r = {};
		for(i in o){ r[i] = o[i]; };
		return r;
	},
	toArray : function(o){
		return (o instanceof Array) ? o : [o];
	}
};
