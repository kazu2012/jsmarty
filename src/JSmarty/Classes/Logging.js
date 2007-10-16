JSmarty.Classes.Logging = JSmarty.Classes.create(null);
JSmarty.Classes.Logging.prototype =
{
	buffer : null,
	info : function(f, m){
		return this.main('info', f, m);
	},
	warn : function(f, m){
		return this.main('warn', f, m);
	},
	main : function(l, f, m)
	{
		var s = (m instanceof Error) ? m.message || m.toString() : m;
		this.append('[', l ,']', s, ' from ', f);
		return m;
	},
	show : function(f){
		(f || JSmarty.System.outputString)(this.buffer.toString());
	},
	append : function(){
		this.buffer.append.apply(null, arguments);
	},
	toString : function(){
		return this.buffer.toString('\n');
	}
};
JSmarty.Logging = new JSmarty.Classes.Logging();
if(typeof(console) != 'undefined'){
	JSmarty.Classes.Logging.prototype.append = console.log;
};
