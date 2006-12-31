JSmarty.Browser = function()
{
	var path, time = {}, sys = JSmarty.System;
	// -- XMLHttpRequestObject
	var http = function()
	{
		if(typeof(XMLHttpRequest) != 'undefined')
			return new XMLHttpRequest;
		if(typeof(ActiveXObject) != 'undefined')
			return new ActiveXObject('Microsoft.XMLHTTP');
		return null;
	}();
	// -- properties
	sys.prop = { name : 'http', code : 10, auth : 'shogo' };
	// -- fgets function
	sys.fgets = function(u, d)
	{
		var i, f, t, h = http;
		d = JSmarty.Utility.flatten(d);
		for(i=0,f=d.length;i<f;i++)
		{
			if(t != null) break;
			try
			{
				h.open('GET', d[i] + '/' + u, false); h.send('');
				if(h.status == 200 || h.status == 0)
				{
					t = h.responseText;
				};
			}
			catch(e){/* empty */}
			finally{ h.abort(); };
		};
		return t || '';
	};
	// -- mtime function
	sys.mtime = function()
	{
		
	};
	// -- print function
	sys.print = function(s){
		document.write(s);
	};
	// -- getSelfPath function
	path = (function(e)
	{
		if(e.nodeName.toLowerCase() == 'script') return e;
		return arguments.callee(e.lastChild);
	})(document).getAttribute('src');
	path = path.slice(0, path.lastIndexOf('/'));

	sys.getSelfPath = function(){ return path; };
};

