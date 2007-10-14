JSmarty.Classes =
{
	create : function(o)
	{
		var i, p = new JSmarty.Classes.Object();
		for(i in o){ p[k] = o[k]; };
		return p;
	}
};
