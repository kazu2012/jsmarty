JSmarty.Browser =
{
	timestamp : {},
	/**
	 * XMLHttpRequest Object
	 * @type XMLHttpRequest
	 */
	newRequest : function()
	{
		var i, x;
		if(typeof(ActiveXObject) != 'undefined')
		{
			x =
			[
				'Microsoft.XMLHTTP',
				'Msxml2.XMLHTTP',
				'Msxml2.XMLHTTP.3.0',
				'Msxml2.XMLHTTP.4.0',
				'Msxml2.XMLHTTP.5.0'
			];

			for(i=x.length-1;0<=i;i--)
			{
				try{ return new ActiveXObject(x[i]); }
				catch(e){ };
			};
		};

		if(typeof(XMLHttpRequest) != 'undefined'){
			return new XMLHttpRequest();
		};

		return null;
	},
	buildSystemObject : function()
	{
		(function()
		{
			var s = document.getElementsByTagName('script');
			var p = s[s.length - 1].getAttribute('src');
			var i = p.lastIndexOf('/'), s = null;
			p = (i == -1) ? '.' : p.slice(0, i);
			JSmarty.System.path = p;
			JSmarty.Plugin.addRepository(p + '/internals');
		})();

		var def = JSmarty.System;

		def.read = function(f, d)
		{
			var Browser = JSmarty.Browser;

			var i, l, r, s = false;
			var h = Browser.Request;
			var a = this.buildPath(f, d);

			for(i=0,l=a.length;i<l;i++)
			{
				try
				{
					h.open('GET', a[i], false);
					h.send('');
					if(h.status == 200 || h.status == 0)
					{
						s = true;
						r = h.responseText;
						Browser.timestamp[a[i]] = h.getResponseHeader();
						break;
					};
				}
				catch(e){}
				finally{ h.abort(); };
			};

			return r || function()
			{
				JSmarty.Error.raise('System : can\'t load the ' + f);
				return null;
			}();
		};

		def.time = function(f, d)
		{
			var t = JSmarty.Browser.timestamp;
			var i, f, a = this.buildPath(f, d);
			for(i=0,f=a.length;i<f;i++){
				if(a[i] in t){ break; };
			};
			return t[a[i]];
		};

		def.getArgs = function()
		{
			var v = {}, s = String(location.search).slice(1);
			JSmarty.Plugin.getFunction('php.parse_str')(s, v);
			return (k == void(0)) ? v : (v[k] == void(0)) ? null : v[k];
		};

		def.print = function(){
			document.write(Array.prototype.join.call(arguments, ''));
		};

		def.outputString = document.write;

		this.Request = this.newRequest();
		this.buildSystemObject = null;
	}
};

JSmarty.System.forName(JSmarty.System.getName());