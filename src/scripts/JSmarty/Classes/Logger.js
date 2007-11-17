JSmarty.Classes.Logger = JSmarty.Classes.create(null);
JSmarty.Classes.Logger.prototype = (typeof(console) != 'undefined') ? console :
{
	/** StringBuffer **/
	buffer : null,
	/** timelines **/
	timeline : null,
	/**
	 * infomation
	 */
	info : function(){ this.append('[info]', arguments); },
	/**
	 * warning
	 */
	warn : function(){ this.append('[warn]', arguments); },
	debug : function(){
		this.append('[debug]', arguments);
	},
	error : function(){
		throw new Error(this.append('[error]', arguments));
	},
	time : function(id)
	{
		this.timelines[id] = JSmarty.System.timestamp();
	},
	timeEnd : function(id)
	{
		var diff = (JSmarty.System.timestamp() - this.timelines[id]);
		this.append(id, ':', diff, 'ms');
	},
	toString : function(){
		return this.buffer.toString('\n');
	}
};
JSmarty.Logger = JSmarty.Classes('Logger');
