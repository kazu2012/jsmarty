JSmarty.Classes.Request = JSmarty.Classes.create
({
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
	newTransport : function(xmlns)
	{
		var tryout = JSmarty.Plugin['util.tryout'];
		return function(){ return tryout(xmlns, null); };
	}([
		function(){ return new ActiveXObject(); },
		function(){ return new ActiveXObject(); },
		function(){ return new XMLHttpRequest(); }
	])
});
