JSmarty.Class.String = JSmarty.Class.create(null);
JSmarty.Class.String.prototype =
{
	initialize : function(args)
	{
		this.value = args[0];
		this.timestamp = new Date().getTime();
	},
	toString : function()
	{
		var str = this.value;
		return str;
	}
};
