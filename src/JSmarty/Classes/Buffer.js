JSmarty.Classes.Buffer = function()
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
JSmarty.Classes.Buffer.prototype = new String();
JSmarty.Classes.Buffer.prototype.appendIf = function(f){
	return (f) ? this.append : function(){};
};
