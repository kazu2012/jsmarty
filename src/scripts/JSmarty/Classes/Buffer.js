JSmarty.Classes.Buffer = function($){ this.init($); };
JSmarty.Classes.Buffer.prototype = new String();
JSmarty.Classes.mixin(JSmarty.Classes.Buffer.prototype,
{
	init : function($)
	{
		var buf = [];
		var c = Array.prototype.join;

		this.append = function(x)
		{
			buf[buf.length] = c.call(arguments,'');
			return this;
		};

		this.getRenderer = function(){ return $; };
		this.getContents = function(){ return buf; };
	},
	plugin : function(name, params, modifier, inner)
	{
		var lambda, P = JSmarty.Plugin;
		var type = (inner) ? 'block' : 'function';

		lambda = P.get(P.name(type, name), this.getRenderer().plugins_dir);

		this.getContents().push((!inner) ?
			lambda(params, this.getRenderer()) :
			lambda(params, inner, this.getRenderer())
		);

		return (modifier) ? this.modify(modifier) : this;
	},
	modify : function(mod, str)
	{
		var P = JSmarty.Plugin, dir = this.getRenderer().plugins_dir;
		var key, str = (arguments.length == 1) ? this.getContents().pop() : str;

		for(key in mod)
		{
			mod[key][0] = str;
			str = P.get('modifier.' + key, dir).apply(null, mod[key]);
		};

		this.getContents().push(str);

		return this;
	},
	appendIf : function(flag){
		return (flag) ? this.append : JSmarty.$function;
	},
	appendUnless : function(flag){
		return (flag) ? JSmarty.$function : this.append;
	},
	valueOf : function(s){
		return this.getContents().join(s || '');
	},
	toString : function(s){
		return this.getContents().join(s || '');
	}
});
