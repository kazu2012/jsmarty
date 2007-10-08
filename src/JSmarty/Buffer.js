JSmarty.Buffer = function()
{
	var i =0, b = [];
	var c = Array.prototype.join;

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
JSmarty.Buffer.create = function(){ return new JSmarty.Buffer(); };
JSmarty.Buffer.prototype = new String();
JSmarty.Buffer.prototype.appendIf = function(f){
	return (f) ? this.append : function(){};
};
