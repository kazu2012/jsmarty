JSmarty.Browser =
{
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
				catch(e){};
			};
		};

		if(typeof(XMLHttpRequest) != 'undefined'){
			return new XMLHttpRequest();
		};

		JSmarty.Logger.warn('cant\'t create XMLHttpRequestObject', 'from', 'Browser#newRequest');
		return null;
	},
	buildSystemObject : function()
	{
		(function()
		{
			var path = JSmarty.System.path;
			var s = document.getElementsByTagName('script');
			var p = s[s.length - 1].getAttribute('src');
			var i = p.lastIndexOf('/'), s = null;
			p = (i == -1) ? path : path + p.slice(0, i);
			JSmarty.Plugin.repos = [p + '/plugins'];
			JSmarty.Plugin.internals = p + '/internals';
		})();

		delete(this.buildSystemObject);
		this.Request = this.newRequest();

		JSmarty.Classes.extend(JSmarty.System)
		({
			read : function(f, d)
			{
				var a = this.buildPath(f, d);
				var i, t, r, x, h = JSmarty.Browser.Request;

				for(i=0,x=a.length;i<x;i++)
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
					JSmarty.Logger.info('can\'t load the ' + f, 'from', 'System#read');
					return null;
				}();
			},
			time : function(f, d)
			{
				var m = this.modified;
				return m[f] || function(o)
				{
					o.read(f, d);
					return m[f] || null;
				}(this);
			},
			getArgs : function(k)
			{
				var v = {}, s = String(location.search).slice(1);
				JSmarty.Plugin.get('php.parse_str')(s, v);
				return (k == void(0)) ? v : (v[k] == void(0)) ? null : v[k];
			},
			outputString : function(){
				document.write(Array.prototype.join.call(arguments,''));
			},
			loadScript : function(path, dir)
			{
				var flag = true;
				try
				{
					(new Function(this.read(path, dir)))();
				}
				catch(e)
				{
					flag = false;
					JSmarty.Logger.warn(e, 'from System#loadScript');
				};
				return flag;
			}
		});
	}
};
JSmarty.System.forName(JSmarty.System.getName());
