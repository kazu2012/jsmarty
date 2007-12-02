JSmarty.Classes.Request = JSmarty.Classes.create(null);
JSmarty.Classes.Request.XMLNS =
[
	function(){ return new ActiveXObject(); },
	function(){ return new ActiveXObject(); },
	function(){ return new XMLHttpRequest(); }
];
JSmarty.Classes.Request.prototype =
{
	caching : null,
	transport : null,
	init : function(){},
	forAsync : function(handler)
	{
		this.handler = handler;
		return this;
	},
	doPost : function()
	{
	},
	doGet : function()
	{
		
	},
	getTransport : function()
	{
		return this.transport || function(self)
		{
			self.transport = self.newTransport();
			return self.transport;
		}(this);
	},
	newTransport : function(){
		return JSmarty.Plugin['util.invoke'](JSmarty.Request.XMLNS, null);
	}
};
