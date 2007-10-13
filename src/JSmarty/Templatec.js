JSmarty.Templatec = new JSmarty.Classes.History();
JSmarty.Templatec.call = function(k, o){
	return this.get(k).call(o);
};
JSmarty.Templatec.newFunction = function(k, s){
	return this.set(k, new Function('$', s));
};
