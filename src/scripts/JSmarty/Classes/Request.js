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
	newTransport : function(xmlns){
		var invoke = JSmarty.Plugin['util.invoke'];
		return function(){ return invoke(xmlns, null); };
	}([
		function(){ return new ActiveXObject(); },
		function(){ return new ActiveXObject(); },
		function(){ return new XMLHttpRequest(); }
	])
});
