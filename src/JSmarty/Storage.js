JSmarty.Storage = function(){
	for(var i=0,f=arguments.length;i<f;i++){
		this[arguments[i]] = null;
	};
};

JSmarty.Storage.prototype =
{
	get : function(k){
		if(k in this){ return this[k]; };
		throw new Error();
	},
	set : function(k, v){
		if(k in this){ this[k] = v; };
		else{ throw new Error(); };
	}
};