JSmarty.Compiler.Module = function(text)
{
	this.text = text;
};
JSmarty.Compiler.Module.prototype =
{
	/** name of module **/
	name : null,
	/** attr of module **/
	attr : null,
	/** type of module **/
	type : 'variable',
	/** modify **/
	modify : null,
	/** symbol **/
	symbol : null,
	/**
	 * parse function
	 * @param {Context} cx context
	 */
	parse : function()
	{
		// resolve namespaces
		var Text = JSmarty.Compiler.Text;
		return function(cx)
		{
			var s, i, f, name, inp = 0, iap = imp = -1;
			var type, src = this.text, symbol = src.charAt(0);

			switch(symbol)
			{
				case '"':
				case "'":
					type = 'string';
					do{inp = src.indexOf(c, inp + 1);}
					while(src.charAt(inp - 1) == '\\');
					imp = src.indexOf('|', ++inp) + 1;
					break;
				case '*':
					type = 'comment';
					break;
				case '#':
					type = 'config';
					break;
				case '$':
					type = 'variable';
					imp = src.indexOf('|');
					break;
				case '/':
					name = src.slice(1);
					cx.setTree(name, true);
					break;
				default:
					iap = src.indexOf(' ');
					imp = src.indexOf('|');
					inp = (-1 < iap) ? iap++ : (-1 < imp) ? imp++ : src.length;
					name = src.slice(0, inp);
					type = cx.typeOf(name);
					cx.setTree(name, false);
					break;
			};
		};
	}(),
	/**
	 * prefix function
	 */
	prefix : function()
	{
		switch(this.name)
		{
			case 'if':
			case 'else':
			case 'elseif':
			case 'foreachelse':
			case 'sectionelse':
				return '';
		};

		switch(this.typeOf())
		{
			case 'primitive':
				return '';
			case 'block':
				return (this.isTerminal()) ? 'return buf.toString();' : 'buf.append(';
			default:
				return 'buf.append(';
		};
	},
	/**
	 * suffix function
	 */
	suffix : function()
	{
		switch(this.name)
		{
			case 'if':
			case 'else':
			case 'elseif':
				return '';
			case 'foreachelse':
			case 'sectionelse':
				return 'function(){var buf = new Builder();';
		};

		switch(this.typeOf())
		{
			case 'block':
				return (this.isTerminal()) ? ');\n' : 'function(){var buf = Builder();';
			case 'primitive':
				return '';
			default:
				return ');\n';
		};
	},
	/**
	 * typeOf function
	 */
	typeOf : function()
	{
		return this.type;
	},
	isTerminal : function()
	{
		return (this.symbol == '/');
	},
	/**
	 * toString funciton
	 */
	toString : function()
	{
		switch(this.symbol)
		{
			case '"':
			case "'":
			case '$':
				return 'self.inModify('+ this.modif +','+ this.name +')';
			case '#':
			case '*':
				return '""';
			case '/':
				switch(this.name)
				{
					case 'if':
						return '}';
					case 'foreach':
					case 'section':
						return '})';
					case 'javascript':
						return '}()';
					case 'literal':
						return '\')';
					case 'strip':
						return '}()).replace(/\\s|\\n/g,"")';
				};
				return '}())';
		};

		switch(this.name)
		{
			case 'if':
				return 'if('+ this.attr +'){';
			case 'else':
				return '}else{';
			case 'elseif':
				return '}else if('+ this.attr +'){';
			case 'ldelim':
				return 'self.left_delimiter';
			case 'rdelim':
				return 'self.right_delimiter';
			case 'strip':
				return 'String(';
			case 'javascript':
				return 'function(){';
			case 'sectionelse':
			case 'foreachelse':
				return 'return buf.toString();},';
			case 'literal':
				return 'self.inModify(' + this.modif + ',\'';
			case 'foreach':
				return 'self.inForeach('+ this.attr +','+ this.modif +',';
/*
			case 'section':
				temp = JSmarty.Compiler.extract(this.attr, 'name');
				this.attr = JSmarty.Compiler.remove(this.attr, 'name');
				if(temp == '') throw new Error("section : missing 'name' parameter");
				return 'self.inSection("'+ temp +'",'+ this.attr +','+ this.modif +',function('+ temp +'){var B=[],I=-1;';
*/
		};

		switch(this.typeOf())
		{
			case 'block':
				return 'self.inCall("'+ this.name +'",'+ this.attr +','+ this.modif +',';
			case 'function':
				return 'self.inCall("'+ this.name +'",'+ this.attr +','+ this.modif;
		}
	}
};