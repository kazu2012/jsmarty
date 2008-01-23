JSmarty.Classes.Loader = JSmarty.Classes.create
({
	caching : null,
	transport : null,
	init : function(isCaching)
	{
		this.caching = (isCaching) ?
			new JSmarty.Classes.History() : {set : function(){}};
	},
	newTransport : function(xmlns)
	{
		var tryout = JSmarty.Plugin['util.tryout'];
		return function(){ return tryout(xmlns, null); };
	}([
		function(){ return new ActiveXObject('Msxml2.XMLHTTP.6.0'); },
		function(){ return new ActiveXObject('Msxml2.XMLHTTP.4.0'); },
		function(){ return new ActiveXObject('Msxml2.XMLHTTP.3.0'); },
		function(){ return new ActiveXObject('Msxml2.XMLHTTP'); },
		function(){ return new ActiveXObject('Microsoft.XMLHTTP'); },
		function(){ return new XMLHttpRequest(); }
	]),
	getTransport : function()
	{
		return this.transport || function($)
		{
			$.transport = $.newTransport();
			return $.transport;
		}(this);
	},
	fetch : function()
	{
		var transport = this.getTransport();
	},
	isSuccess : function(transport)
	{
		
	}
});
