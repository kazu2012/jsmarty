JSmarty.Browser =
{
	loaded : {},
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
				catch(e){
				}
				finally{
					h.abort();
				};
			};
			return t || '';
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

		o._fetchRequest = function(u, d)
		{
		};

		this.initialize = null;
	},
	/**
	 * XMLHttpRequest Object
	 * @type XMLHttpRequest
	 */
	Request : function()
	{
		if(typeof(ActiveXObject) != 'undefined'){
			return new ActiveXObject('Microsoft.XMLHTTP');
		};
		if(typeof(XMLHttpRequest) != 'undefined'){
			return new XMLHttpRequest();
		};
		return null;
	}()
};

(function(def)
{
	def.setProfile(def.getTypeCode(this));
})(JSmarty.System);