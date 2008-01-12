JSmarty.Classes.Buffer = function(){ this.init(); };
JSmarty.Classes.Buffer.prototype = new String();
JSmarty.Classes.mixin(JSmarty.Classes.Buffer,
{
	init : function($)
	{
		var buf = [];
		var c = Array.prototype.join;

		this.append = function()
		{
			buf[buf.length] = c.call(arguments,'');
			return this;
		};

		this.getRenderer = function(){ return $; };
		this.getContents = function(){ return buf; };
	},
	plugin : function(name, params, modifier, inner)
	{
		var lambda, Plugin = JSmarty.Plugin;
		var type = (inner) ? 'block' : 'function';

		lambda = Plugin.get(Plugin.name(type, name));

		this.getContents().push((!inner) ?
			lambda(params, this.getRenderer()) :
			lambda(params, inner, this.getRenderer())
		);

		return (modifier) ? this.modify(modifier) : this;
	},
	modify : function(modifier)
	{
		var Plugin = JSmarty.Plugin;
		var name, str = this.getContents().pop();

		for(name in modifier)
		{
			modifier[name][0] = str;
			str = Plugin.get('modifier.' + name, dir).apply(null, modifier[k]);
		};

		this.getContents().push(str);
		return this;
	},
	appendIf : function(flag){
		return (flag) ? this.append : JSmarty.emptyFunction;
	},
	appendUnless : function(flag){
		return (flag) ? JSmarty.empthFunction : this.append;
	},
	valueOf : function(s){
		return this.getContents().join(s || '');
	},
	toString : function(s){
		return this.getContents().join(s || '');
	}
});
