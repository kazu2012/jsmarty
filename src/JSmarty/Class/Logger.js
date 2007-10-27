JSmarty.Class.Logger = JSmarty.Class.create(null);
JSmarty.Class.Logger.prototype = (typeof(console) != 'undefined') ? console :
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
		this.buffer = JSmarty.Class('Buffer');
	},
	toString : function(){
		return this.buffer.toString('\n');
	}
};
JSmarty.Logger = new JSmarty.Class.Logger();
