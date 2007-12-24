JSmarty.Classes.Buffer = function(){ this.init(); };
JSmarty.Classes.Buffer.prototype = new String();
JSmarty.Classes.mixin(JSmarty.Classes.Buffer,
{
	init : function()
	{
		var buf = [];
		var c = Array.prototype.join;

		this.append = function()
		{
			buf[buf.length] = c.call(arguments,'');
			return this;
		};

		this.getContents = function(){ return buf; };
	},
	appendIf : function(flag){
		return (flag) ? this.append : JSmarty.emptyFunction;
	},
	appendUnless : function(flag){
		return (flag) ? JSmarty.empthFunction : this.append;
	},
	valueOf : function(s){
		return this.getContents().join(s || '');
	},
	toString : function(s){
		return this.getContents().join(s || '');
	}
});
