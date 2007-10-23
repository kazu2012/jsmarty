JSmarty.Classes.Logging = JSmarty.Classes.create(null);
JSmarty.Classes.Logging.prototype = (typeof(console) != 'undefined') ? console :
{
	buffer : null,
	timeline : null,
	log : function()
	{
		var args = JSmarty.Plugin.get('core.argsformat')(arguments);
		this.buffer.append(args);
		return args;
	},
	info : function(){
		this.log('['+ info +']', arguments);
	},
	warn : function(){
		this.log('['+ warn +']', arguments);
	},
	error : function(){
		throw new Error(this.log('['+ error +']', arguments));
	},
	time : function(id){
		this.timelines[id] = new Date().getTime();
	},
	debug : function(){
		this.log('[' + debug + ']', arguments);
	},
	timeEnd : function(id)
	{
		var time = (new Date().getTime() - this.timeline[id]);
		this.log(id, ':', time, 'ms');
	},
	initialize : function()
	{
		this.timeline = {};
		this.buffer = JSmarty.Classes('Buffer');
	},
	toString : function(){
		return this.buffer.toString('\n');
	}
};
JSmarty.Logging = new JSmarty.Classes.Logging();
