/**
 * Provide interface of System.
 * @type JSmarty.System.Object
 */
JSmarty.System =
{
	IDUNDEF : 10,
	IDBRWSR : 20,
	IDAJAJA : 30,
	IDMSTNG : 40,
	IDWSCPT : 50,
	IDXPCOM : 60,

	fputs : null,
	mtime : null,
	print : null,

	property : new JSmarty.Storage({name : null, code : 10}),

	isWritable : function(){
		return (this.fputs != null);
	},

	getSelfPath : function(){
		return '.';
	},

	genSysCode : function(g)
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