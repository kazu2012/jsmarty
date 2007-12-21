JSmarty.Compiler.Context = JSmarty.Classes.create
({
	/** stack of tags **/
	tags : null,
	/** the elements are type of block **/
	blockElement : null,
	/** the elements are type of plain **/
	plainElement : null,
	/** index of plain element **/
	iPlain : -1,
	/** left_delimiter **/
	ldelim : '{',
	/** right_delimiter **/
	rdelim : '}',
	className : 'Context',
	set : function(key, value){
		this[key] = value;
	},
	get : function(key){
		return this[key];
	},
	init : function()
	{
		var clone = JSmarty.Plugin['util.clone'];
		this.tags = [], this.blockElement = {};
		this.plainElement = clone(JSmarty.Compiler.Context.PLAIN);
	},
	/**
	 * setTree function
	 * @param {String}  n name
	 * @param {Boolean} f terminal
	 */
	setTree : function(n, f)
	{
		var t = this.tags, p = this.plainElement;

		if(n in this.blockElement)
		{
			if(f)
			{
				if(n != t.pop()){
					this._error();
				};
				if(n in p && this.iPlain == t.length){
					this.iPlain = -1;
				};
			}
			else
			{
				t.push(n);
				if(n in p && this.iPlain == -1){
					this.iPlain = t.length - 1;
				};
			};
		};

		return n;
	},
	/**
	 * isPlain function
	 * @return Boolean
	 */
	isPlain : function(){
		return (0 <= this.iPlain);
	},
	/**
	 * addElement function
	 * add the type of element to this context.
	 * @param {String} type of element
	 * @param {String} name of element
	 */
	addElement : function(type, name)
	{
		switch(type)
		{
			case 'block':
				this.blockElement[name] = true;
				break;
			case 'plain':
				this.plainElement[name] = true;
				break;
		};
	},
	/**
	 * Return the type of element
	 * @param {String} name of element
	 * @return{String} type of element
	 */
	typeOf : function(name)
	{
		var Plugin = JSmarty.Plugin;

		switch(true)
		{
			case (JSmarty.Compiler.isBuiltIn(name)):
				return 'builtin';
			case (name in this.blockElement):
				return 'block';
			case (Plugin.isEnabled('function.' + name, this.plugins_dir)):
				return 'function';
			case (Plugin.isEnabled('compiler.' + name, this.plugins_dir)):
				return 'compiler';
		};

		return 'function';
	}
});
JSmarty.Compiler.Context.PLAIN = {strip:true,literal:true,javascript:true};