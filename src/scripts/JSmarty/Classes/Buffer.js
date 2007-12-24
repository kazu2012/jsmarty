JSmarty.Classes.Buffer = function(){ this.init(); };
JSmarty.Classes.Buffer.prototype = new String();
JSmarty.Classes.mixin(JSmarty.Classes.Buffer,
{
	init : function()
	{
		var i = 0, buf = [];
		var c = Array.prototype.join;

		this.append = function()
		{
			buf[i++] = c.call(arguments,'');
			return this;
		};
		this.valueOf = this.toString = function(s){
			return buf.join(s || '');
		};

		this.getContents = function(){ return buf; };
	},
	appendIf : function(flag){
		return (flag) ? this.append : JSmarty.emptyFunction;
	},
	appendUnless : function(flag){
		return (flag) ? JSmarty.empthFunction : this.append;
	}
});
