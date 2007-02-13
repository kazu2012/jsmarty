JSmarty.Browser = function(def)
{
	var time = {}

	if(!document.scripts){
		document.scripts = document.getElementsByTagName('script');
	};

	// -- XMLHttpRequestObject
	var http = function()
	{
		if(typeof(XMLHttpRequest) != 'undefined'){
			return new XMLHttpRequest;
		};
		if(typeof(ActiveXObject) != 'undefined'){
			return new ActiveXObject('Microsoft.XMLHTTP');
		};
		return null;
	}();

	// -- properties
	def.prop = { name : 'http', code : 10, auth : 'shogo' };

	// -- fgets function
	def.fgets = function(u, d)
	{
		var i, f, t, h = http;
		d = JSmarty.Utility.toArray(d);
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
	def.mtime = function()
	{
		
	};

	// -- print function
	def.print = function(s){
		document.write(s);
	};

	def.getSelfPath = function()
	{
		var path = document.scripts[document.scripts.length-1].getAttribute('src');
		path = path.slice(0, path.lastIndexOf('/'));
		return function(){ return path; };
	}();
};

