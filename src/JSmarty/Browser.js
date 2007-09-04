JSmarty.Browser =
{
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
		var o = JSmarty.System;

		o.modified = {};

		o.read = function(f, d)
		{
			var a = this.buildPath(f, d);
			var i, t, r, h = JSmarty.Browser.Request;

			for(i=a.length-1;0<=i;i--)
			{
				try
				{
					h.open('GET', a[i], false);
					h.send('');
					if(h.status == 200 || h.status == 0)
					{
						r = h.responseText;
						t = h.getResponseHeader('last-modified');
						this.modified[f] = (t) ? new Date(t).getTime() : new Date().getTime();
						break;
					};
				}
				catch(e){}
				finally{ h.abort(); };
			};

			return r || function()
			{
				JSmarty.Error.log('System', 'can\'t load the ' + f);
				return null;
			}();
		};

		o.time = function(f, d)
		{
			var m = this.modified;
			return m[f] || function(o)
			{
				o.read(f, d);
				return m[f] || null;
			}(this);
		};

		o.getArgs = function(k)
		{
			var v = {}, s = String(location.search).slice(1);
			JSmarty.Plugin.getFunction('php.parse_str')(s, v);
			return (k == void(0)) ? v : (v[k] == void(0)) ? null : v[k];
		};

		o.outputString = document.write;

		this.buildSystemObject = null;
		this.Request = this.newRequest();
	}
};

JSmarty.System.forName(JSmarty.System.getName());