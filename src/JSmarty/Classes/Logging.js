JSmarty.Classes.Logging = JSmarty.Classes.create(null);
JSmarty.Classes.Logging.prototype = (typeof(console) != 'undefined') ? console : 
{
	timelines : null,
	log : function(){},
	info : function(){},
	warn : function(){},
	error : function(){},
	time : function(name){
		this.timelines[name] = new Date().getTime();
	},
	timeEnd : function(){},
	debug : function(){},
	initialize : function(){ this.timelines = {}; }
};
JSmarty.Logging = new JSmarty.Classes.Logging();
