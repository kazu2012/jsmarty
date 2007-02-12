JSmarty.Buffer = function()
{
	var k = -1, b = [];

	this.append = function()
	{
		for(var i=0,f=arguments.length;i<f;i++)
		{
			if(!arguments[i]){ return; };
			b[++k] = arguments[i];
		};
	};

	this.valueOf = this.toString = function(s){
		return b.join(s || '');
	};
};
JSmarty.Buffer.prototype = new String();