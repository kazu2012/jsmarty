JSmarty.Navigator =
{
	newRequest : function(xmlns)
	{
		var tryout = JSmarty.Plugin['util.tryout'];
		return function(){ return tryout(xmlns, null); };
	}([
		function(){ return new ActiveXObject('Msxml2.XMLHTTP.4.0'); },
		function(){ return new ActiveXObject('Msxml2.XMLHTTP.3.0'); },
		function(){ return new ActiveXObject('Msxml2.XMLHTTP'); },
		function(){ return new ActiveXObject('Microsoft.XMLHTTP'); },
		function(){ return new XMLHttpRequest(); }
	]),
	getCurrentScript : function()
	{
		var scripts = document.getElementsByTagName('script');
		return scripts[scripts.length - 1];
	},
	addScript : function(url, query, option)
	{
		var i, http_build_query = JSmarty.Plugin.get('php.http_build_query');
		var script = document.createElement('script');
		script.src = (query) ? url + '?' + http_build_query(query) : url;
		for(i in option){ script[i] = option[i]; };
		document.getElementsByTagName('body')[0].appendChild(script);
		script = null;
	},
	setEnviroment : function()
	{
		var slice = JSmarty.Plugin['util.slice'];

		var currentScript = this.getCurrentScript();
		var query, path, script, Classes = JSmarty.Classes;

		path = slice(currentScript.src, '/', true) || '.';
		query = slice(currentScript.src, '?') || '';

		Classes.mixin(JSmarty.Plugin,
		{
			repos : [path + '/plugins'],
			internals : path + '/internals'
		});

		Classes.mixin(JSmarty.System, this.$SYSTEM);

		if(query != '')
		{
			JSmarty.prototype.compiler_class = query;
			script = document.createElement('script');
			script.src = path + '/JSmarty/' + query +'.js';
			currentScript.parentNode.insertBefore(script, null);
		};

		if(typeof(jQuery) != 'undefined')
		{
			script = document.createElement('script');
			script.src = path + '/internals/system.jquery.js';
			currentScript.parentNode.insertBefore(script, null);
		};

		this.Request = this.newRequest();
		currentScript = null, this.$SYSTEM = null;
		this.setEnviroment = JSmarty.emptyFunction;
	}
};

JSmarty.Navigator.$SYSTEM =
{
	read : function(f, d)
	{
		var a = this.buildPath(f, d);
		var i, t, r, x, h = JSmarty.Navigator.Request;

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
			JSmarty.Logger.invoke('info')('can\'t load the ' + f, 'from', 'System#read');
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
		try
		{
			(new Function(this.read(path, dir || '')))();
			return true;
		}
		catch(e)
		{
			JSmarty.Logger.invoke('error')(e, 'from System#loadScript');
		};

		return false;
	}
};
