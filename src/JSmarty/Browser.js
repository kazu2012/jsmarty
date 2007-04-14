JSmarty.Browser = function(def)
{
	var time = {}

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
	def.print = function(){
		document.write(Array.prototype.join.call(arguments, ''));
	};

	// setup for 'internals' dir
	def.setInternals = function()
	{
		var s = document.getElementsByTagName('script');
		var p = s[s.length - 1].getAttribute('src');
		var i = p.lastIndexOf('/'), s = null;
		p = (i == -1) ? '.' : p.slice(0, i);
		JSmarty.Plugin.addRepository(p + '/internals');
	}();
};

(function(def)
{
	def.setProfile(def.genSysCode(this));
})(JSmarty.System);

