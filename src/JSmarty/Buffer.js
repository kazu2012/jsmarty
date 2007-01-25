JSmarty.Buffer = function()
{
	var k = -1, b = [];

	this.append = function()
	{
		for(var i=0,f=arguments.length;i<f;i++)
		{
			if(!argumtens[i]){ return; };
			b[++k] = argumtens[i];
		};
	};

	function toString(s){ return b.join(s || ''); };
	this.valueOf = this.toString = toString;
};
JSmarty.Buffer.prototype = new String();