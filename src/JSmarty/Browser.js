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
	initialize : function()
	{
		(function()
		{
			var s = document.getElementsByTagName('script');
			var p = s[s.length - 1].getAttribute('src');
			var i = p.lastIndexOf('/'), s = null;
			p = (i == -1) ? '.' : p.slice(0, i);
			JSmarty.Plugin.addRepository(p + '/internals');
		})();

		var o = JSmarty.System;

		o.fgets = function(u, d)
		{
			var i, f, t, h = JSmarty.Browser.Request;
			d = JSmarty.Plugin['shared.toArray'](d);
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
				catch(e){
				}
				finally{
					h.abort();
				};
			};
			return t || '';
		};

		o.mtime = function(){
		};

		o.fetch = function()
		{
			
		};

		o.getArgs = function()
		{
			var v = {}, s = String(location.search).slice(1);
			JSmarty.Plugin.getFunction('php.parse_str')(s, v);
			return (k == void(0)) ? v : (v[k] == void(0)) ? null : v[k];
		};

		o.print = function(){
			document.write(Array.prototype.join.call(arguments, ''));
		};

		this.Request = this.newRequest();
		this.initialize = null;
	}
};

(function(def)
{
	def.setProfile(def.getTypeCode(this));
})(JSmarty.System);