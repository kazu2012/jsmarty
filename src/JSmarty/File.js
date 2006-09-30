/**
 * Construct
 * @class Provide interface of File I/O.
 * @constructor
 */
JSmarty.File =
{
	/** @private **/
	_mtimes : {},
	/** @private **/
	_system : function()
	{
		if(JSmarty.GLOBALS.System)
			return 'ajaja';
		return 'http';
	}(),
	/**
	 * XMLHttpObject
	 * @type XMLHttpRequest or null
	 */
	XMLHTTP : function()
	{
		if(JSmarty.GLOBALS.XMLHttpRequest)
			return new XMLHttpRequest;
		if(JSmarty.GLOBALS.ActiveXObject)
			return new ActiveXObject('Microsoft.XMLHTTP');
		return null;
	}(),
	/**
	 * file_get_contents
	 * @param  {String} path File-path.
	 * @return {String or null} Contents of file or null.
	 */
	fgets : function(path)
	{
		var text, http;

		switch(this._system)
		{
			case 'http':
				http = this.XMLHTTP;
				http.open('GET', path, false);
				try
				{
					http.send('');
					text = http.responseText;
					this._mtimes[path] = http.getResponseHeader('Last-Modified');
				}
				catch(e){ /* empty */ }
				finally{ http.abort(); };
				return text || null;
			case 'ajaja':
				try{ return System.readFile(path); }
				catch(e){ /* empty */ };
				return null
		};

		return null;
	},
	/**
	 * file_put_contents
	 * @return {Boolean} The function sucess, or not.
	 */
	fputs : function(src, file)
	{
		var fso, txt;

//		switch(this._system)
//		{
//		};

		return false;
	},
	/**
	 * Return the timestamp of file
	 * @return {Number}
	 */
	mtime : function(path)
	{
		switch(this._system)
		{
			case 'http':
				return this._mtimes[path];
			case 'ajaja':
				return new Date().getTime(); // temp
		};

		return null;
	},
	/**
	 * 
	 * @param {Object} system
	 */
	require : function(script)
	{
		return function()
		{
			var element, loaded = this.loaded;
			if(loaded[script]) return;
			element = document.createElement('script');
			element.type = 'text/javascript';
			element.src  = script;
		};
	}(),
	setSystem : function(system){
		this._system = system;
	},
	getSystem : function(){
		return this._system;
	}
};