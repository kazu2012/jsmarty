JSmarty.Class.Hash = JSmarty.Class.create(null);
JSmarty.Class.Hash.prototype =
{
	logger : JSmarty.Logger,
	get : function(k)
	{
		if(this.isExit(k)){ return this[k]; };
		this.logger.info();
	},
	set : function(k, v)
	{
		if(this.isExit(k)){ this[k] = v; }
		else{ this.logger.info(); };
	},
	isExit : function(k){
		return (k in this);
	}
};
