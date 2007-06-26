JSmarty.Storage = function(o)
{
	for(var i in o){
		this[i] = o[i]
	};
};
JSmarty.Storage.prototype =
{
	get : function(k){
		if(k in this){ return this[k]; };
		JSmarty.Error.raise();
	},
	set : function(k, v){
		if(k in this){ this[k] = v; }
		else{ JSmarty.Error.raise(); };
	}
};
