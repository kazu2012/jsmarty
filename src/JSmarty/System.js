/**
 * Provide interface of System.
 * @type JSmarty.System.Object
 */
JSmarty.System =
{
	IDUNDEF : 0x1,
	IDBRWSR : 0x2,
	IDAJAJA : 0x4,
	IDMSTNG : 0x8,
	IDWSCPT : 0x16,
	IDXPCOM : 0x32,

	fputs : null,
	mtime : null,
	print : null,

	property : new JSmarty.Storage({name : null, code : 0x1}),

	isWritable : function(){
		return (this.fputs != null);
	},

	getArgs : function(){
		return null;
	},

	getSelfPath : function(){
		return '.';
	},

	getTypeCode : function(g)
	{
		if(g.window  && g.document){ return this.IDBRWSR; };
		if(g.System  && g.Core    ){ return this.IDAJAJA; };
		if(g.context && g.javax   ){ return this.IDMSTNG; };

		return this.IDUNDEF;
	},

	setProfile : function(v, c)
	{
		switch(v)
		{
			case this.IDBRWSR: JSmarty.Browser(JSmarty.System); break;
			case this.IDAJAJA: load('./internals/system.ajaja.js'); break;
			case this.IDMSTNG: load('./internals/system.mustang.js'); break;
		};
	},

	getProperty : function(k){
		return this.property.get(k);
	}
};