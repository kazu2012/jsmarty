JSmarty.Classes.String = JSmarty.Classes.create(null);
JSmarty.Classes.String.prototype =
{
	initialize : function(args){
		this.value = args[0];
	},
	toString : function()
	{
		var value = this.value;
		var Plugin = JSmarty.Plugin;
		return value;
	}
};
