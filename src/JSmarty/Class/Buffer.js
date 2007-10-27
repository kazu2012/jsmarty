JSmarty.Class.Buffer = function()
{
	var i =0, b = [], o = this;
	var c = Array.prototype.join;
	this.append = function()
	{
		b[i++] = c.call(arguments,'');
		return o;
	};
	this.valueOf = this.toString = function(s){
		return b.join(s || '');
	};
};
JSmarty.Class.Buffer.prototype = new String();
JSmarty.Class.Buffer.prototype.appendIf = function(flag){
	return (flag) ? this.append : this.NullFunction;
};
JSmarty.Class.Buffer.prototype.appendUnless = function(flag){
	return (flag) ? this.NullFunction : this.append;
};
JSmarty.Class.Buffer.prototype.NullFunction = function(){};
