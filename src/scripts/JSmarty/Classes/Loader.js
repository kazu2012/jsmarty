JSmarty.Classes.Loader = JSmarty.Classes.create
({
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
	])
});
