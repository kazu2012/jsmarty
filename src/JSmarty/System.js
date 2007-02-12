/**
 * Provide interface of File I/O.
 * @type JSmartyFileObject
 */
JSmarty.System = new function()
{
	this.prop = { name : null, code : 0, auth : null };

	this.isWritable = function(){ return (this.fputs != null); };
	this.fputs = this.mtime = this.print = this.getSelfPath = null;

	this.genSysCode = function(g)
	{
		if(g.window  && g.document) return 10; // Browser
		if(g.System  && g.Core    ) return 20; // Ajaja
		if(g.context && g.javax   ) return 30; // Mustang
	};

	this.setProfile = function(v, c)
	{
		switch(v)
		{
			case 10: JSmarty.Browser(JSmarty.System); break;
			case 20: load('./internals/system.ajaja.js'); break;
			case 30: load('./internals/system.mustang.js'); break;
			default: c(); break;
		};
	};

	this.getProperty = function(p)
	{
		switch(p)
		{
			case 'name': return this.prop.name;
			case 'code': return this.prop.code;
			case 'auth': return this.prop.auth;
		};
		return null;
	};
};

(function(def)
{
	def.setProfile(def.genSysCode(this));
})(JSmarty.System);

