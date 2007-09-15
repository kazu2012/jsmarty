JSmarty.Buffer = function(s)
{
	var c = Array.prototype.join;
	var b = (s) ? [s] : [], i = b.length;

	this.append = function()
	{
		b[i++] = c.call(arguments,'');
		return this;
	};

	this.get = function(n){
		return b[(n < 0) ? b.length + n : n];
	};

	this.valueOf = this.toString = function(s){
		return b.join(s || '');
	};
};
JSmarty.Buffer.prototype = new String();