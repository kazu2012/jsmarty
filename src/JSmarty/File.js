/**
 * Provide interface of File I/O.
 * @type JSmartyFileObject
 */
JSmarty.File =
{
	/** @private **/
	__mtimes__ : {},
	/** @private **/
	__system__ : 'http',
	/**
	 * XMLHttpObject
	 * @type XMLHttpRequest or null
	 */
	XMLHTTP : function()
	{
		if(typeof(XMLHttpRequest) != 'undefined')
			return new XMLHttpRequest;
		if(typeof(ActiveXObject) != 'undefined')
			return new ActiveXObject('Microsoft.XMLHTTP');
		return null;
	}(),
	/**
	 * file_get_contents
	 * @param  {String} path File-path.
	 * @return {String or null} Contents of file or null.
	 */
	fgets : function(file, dir)
	{
		var text, http = this.XMLHTTP;

		dir = JSmarty.flatten(dir);

		for(var i=0,fin=dir.length;i<fin;i++)
		{
			if(text) break;
			try
			{
				http.open('GET', dir[i] +'/'+ file, false);
				http.send('');
				text = http.responseText;
			}
			catch(e){ /* empty */ }
			finally{ http.abort(); };
		};

		return text || '';
	},
	/**
	 * file_put_contents
	 * @return {Boolean} The function sucess, or not.
	 */
	fputs : function(src, file)
	{
		/* abstract */
		return false;
	},
	/**
	 * Return the timestamp of file
	 * @param {String}
	 * @return {Number}
	 */
	mtime : function(path){
		return this.__mtimes__[path];
	},
	setSystem : function(system)
	{
		switch(system)
		{
			case 'ajaja':
				loadScript(Core.JSPATH + '/internals/core.ajaja.js');
				break;
			case 'wscript':
				break;
			default:
				JSmarty.trigger_error(" system: no-supported for "+ system);
		};
		this.__system__ = system;
	},
	getSystem : function(){
		return this.__system__;
	}
};

(function()
{
	if(typeof(System) != 'undefined')
	{
		JSmarty.File.setSystem('ajaja');
		return;
	};
})();