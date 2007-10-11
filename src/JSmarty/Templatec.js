JSmarty.Templatec = new JSmarty.Classes.History();
JSmarty.Templatec.call = function(k, o){
	this.get(k).call(o);
};
JSmarty.Templatec.newFunction = function(k, s){
	this.set(k, new Function(s));
};
