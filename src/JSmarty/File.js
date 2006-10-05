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
	fgets : function(file, dir)
	{
		var text, http = this.XMLHTTP;
		return text;
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
	 * @return {Number}
	 */
	mtime : function(path){
		return this.__mtimes__[file];
	},
	setSystem : function(system)
	{
		switch(system)
		{
			case 'ajaja':
				loadScript(Core.JSPATH + 'internal/core.ajaja.js'):
				break;
			case 'wscript':
				break;
			default:
				JSmarty.trigger_error(" system: no-supported for "+ system);
		};
		this.__system__ = system;
	},
	getSystem : function(){
		return this.___system__;
	}
};

(function()
{
	if(JSmarty.GLOBALS.System)
	{
		JSmarty.File.setSystem('ajaja');
		return;
	};
})();