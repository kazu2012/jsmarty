JSmarty.Classes.Storage = function(o){
	for(var i in o){ this[i] = o[i] };
};
JSmarty.Classes.Storage.prototype =
{
	className : 'Storage',
	get : function(k)
	{
		if(this.isExit(k)){ return this[k]; };
		this._error(k);
	},
	set : function(k, v)
	{
		if(this.isExit(k)){ this[k] = v; }
		else{ this._error(k) };
	},
	ini : function(k, v){
		if(!this.isExit(k)){ this[k] = v; };
	},
	isExit : function(k){
		return (k in this);
	},
	_error : function(k){
		JSmarty.Logging.info(this.className, k + ' is not defined');
	}
};
