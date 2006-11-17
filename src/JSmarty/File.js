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
	 * @param  {String} file Request filename.
	 * @param  {String | Array} dir Request directoryname.
	 * @return {String} Contents of file or ''.
	 */
	fgets : function(file, dir)
	{
		var text, flag = false, http = this.XMLHTTP;

		dir = JSmarty.flatten(dir);

		for(var i=0,f=dir.length;i<f;i++)
		{
			if(text && flag) break;
			try
			{
				http.open('GET', dir[i] +'/'+ file, false);
				http.send('');
				flag = (http.status == 200 || http.status == 0);
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
	mtime : function(file){
		return this.__mtimes__[file];
	},
	setSystem : function(system)
	{
		switch(system)
		{
			case 'ajaja':
				load('./internals/system.ajaja.js'); break;
			case 'wscript': break;
			default:
				JSmarty.trigger_error(" system: no-supported for "+ system);
				break;
		};
		this.__system__ = system;
	},
	getSystem : function(){
		return this.__system__;
	},
	isWritable : function(){
		return false;
	}
};