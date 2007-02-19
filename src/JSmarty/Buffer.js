JSmarty.Buffer = function()
{
	var b = [];
	var c = Array.prototype.concat;

	this.append = function()
	{
		c.apply(b, arguments);
		return this;
	};

	this.valueOf = this.toString = function(s){
		return b.join(s || '');
	};
};
JSmarty.Buffer.prototype = new String();
