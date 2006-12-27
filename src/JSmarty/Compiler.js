/**
 * FILE:
 * JSmarty/Compiler.js
 *
 * LICENCE:
 * This library is free software; you can redistribute it and/or modify
 * it under the LGPL2.1 as published by the Free Software Foundation.
 * See the http://www.gnu.org/licenses/lgpl.txt in this distribution.
 *
 * @author shogo < shogo4405 at gmail dot com>
 * @package JSmarty
 * @version @version@
 */

JSmarty.Compiler = function(renderer)
{
	var Tags = [], Block = {};

	var L = renderer.left_delimiter;
	var R = renderer.right_delimiter;

	var RcrRegExp = /\r?\n/g;
	var VarRegExp = /&&__COM__::__VAR__&&/g;
	var RmvRegExp = /\+""|B\[\+\+I\]=""\;\n/g;
	var BlcRegExp = RegExp(L + '\\/(.*?)' + R,'g');
	var RsvRegExp = /&&__COM__::__VAR__&&smarty\./g;
	var TagRegExp = RegExp(L + '[^'+ R +']*' + R,'g');

	var inner = false, literal = -1;

	var PutString = null, Compiler = JSmarty.Compiler;
	var Module = Compiler.Module, StringBuffer = Compiler.StringBuffer;

	/** plugins_dir **/
	this.plugins_dir = renderer.plugins_dir;

	/**
	 * isContainer function
	 * @param {Module} module
	 */
	function isContainer(module)
	{
		if(Block[module.name])
		{
			module.setProperty('type','block');
			return true;
		};
		return false;
	};

	/**
	 * SetRegExp function
	 */
	function SetRegExp()
	{
		BlcRegExp.compile(L + '\\/(.+?)' + R,'g');
		TagRegExp.compile(L + '[^'+ R +']+' + R,'g');
	};
	/**
	 * SetHeader function
	 * @return {Boolean}
	 */
	function SetDelimiters()
	{
		var flag = false;
		if(L != renderer.left_delimiter ) flag = true, L = renderer.left_delimiter;
		if(R != renderer.right_delimiter) flag = true, R = renderer.right_delimiter;
		return flag;
	};
	
	/**
	 * GenModule function
	 * @param  {String} src source
	 * @return {String}
	 */
	function genModule(src)
	{
		var m = new Module(src);
		var n = m.getProperty('name');

		if(isContainer(m))
		{
			if(m.isClose())
			{
				if(n != Tags.pop()) throw new Error("");
			}
			else
			{
				Tags.push(n);
				switch(n)
				{
					case 'if':
						break;
					default:
						PutString('B[++I]=');
						break;
				};
			};
		}
		else
		{
			switch(n)
			{
				case 'else':
				case 'elseif':
				case 'sectionelse':
				case 'foreachelse':
					break;
				default:
					PutString('B[++I]=');
					break;
			};
		};

		PutString(m);
	};
	/**
	 * GenModule function
	 * @param  {String} src source
	 */
	function genString(src)
	{
		if(!src) return;
		if(src && -1 < src.indexOf('"')) src = src.split('"').join('\\"');
		if(src && 0 == src.indexOf('\\n')) src = src.slice(2);
		PutString('B[++I]="'+ src + '";\n');
	};
	/**
	 * header function
	 */
	function header()
	{
		PutString('var I=-1,B=[],O={},V=this._tpl_vars,self=this;\n');
	};
	/**
	 * filter function
	 */
	function filter(src, type)
	{
		switch(type)
		{
			case 'pre':
				src = src.replace(RcrRegExp,'\\n');
				break;
			case 'post':
			//	src = src.replace(RmvRegExp,'');
				src = src.replace(RsvRegExp,'this._');
				src = src.replace(VarRegExp,'V.');
				break;
		};
		return src;
	};
	/**
	 * footer function
	 */
	function footer(src)
	{
		return src + 'return B.join("");';
	};
	/**
	 * parser function
	 * @param {String} src source
	 */
	function parser(src)
	{
		var r, p, isp, tag, iap = 0;
		var ilp = L.length, irp = -R.length;

		// scan block element
		p = BlcRegExp;
		while((r = p.exec(src)) != null)
		{
			Block[r[1]] = true;
		};

		// scan tag element and string
		p = TagRegExp;
		while((r = p.exec(src)) != null)
		{
			tag = r[0];
			isp = src.indexOf(tag, iap);
			genString(src.slice(iap, isp));
			genModule(tag.slice(ilp, irp));
			iap = isp + tag.length;
		};

		(iap == src.length) ? PutString(';\n') : genString(src.slice(iap));
	};
	/**
	 * execute function - compile a source
	 * @param {String} src source
	 */
	this.execute = function(src)
	{
		var buffer= new StringBuffer();
		PutString = buffer.apend;
		if(SetDelimiters()) SetRegExp();
		header();
		parser(filter(src, 'pre'));
		return footer(filter(buffer.toString(''), 'post'));
	};
};

/** Module **/
JSmarty.Compiler.Module = function(src){ this.parse(src); };
JSmarty.Compiler.Module.prototype =
{
	name : null,
	attr : 'O',
	type : 'function',
	modif : null,
	inner : false,
	symbol : null,
	parse : function(src)
	{
		var inp = 0, iap = imp = -1;
		var s, i, f, op, c = src.charAt(0);

		switch(c)
		{
			case '"':
			case "'":
				do{inp = src.indexOf(c, inp + 1);}
				while(src.charAt(inp - 1) == '\\');
				imp = src.indexOf('|', ++inp) + 1;
				this.name = src.slice(0, inp);
				this.symbol = c;
				break;
			case '*':
				this.symbol = c;
				return;
			case '#':
				inp = src.indexOf(c);
				this.name = src.slice(1, inp++);
				this.symbol = c;
				break;
			case '$':
				imp = src.indexOf('|');
				this.name = '&&__COM__::__VAR__&&' + src.slice(1, (-1 < imp) ? imp++ : src.length);
				this.symbol = c;
				break;
			case '/':
				this.name = src.slice(1);
				this.symbol = c;
				break;
			default:
				iap = src.indexOf(' ');
				imp = src.indexOf('|');
				inp = (-1 < iap) ? iap++ : (-1 < imp) ? imp++ : src.length;
				this.name = src.slice(0, inp);
				this.symbol = '';
				break;
		};

		if(-1 < iap)
		{
			s = src.slice(iap).split('');

			switch(this.name)
			{
				case 'if':
				case 'elseif':
					op = JSmarty.Compiler.OPERATORS;
					outerloop:
					for(i=0,f=s.length;i<=f;i++)
					{
						switch(s[i])
						{
							case '$':
								s[i++] = '&&__COM__::__VAR__&&';
								break;
							case '"':
							case "'":
								c = s[i++];
								while(s[i] != c && i <= f) ++i;
								if(f + 1 < i) throw new Error("");
								if(s[i-1] == '\\') i--;
								break;
							case ' ':
								c = '';
								while(s[++i] != ' ' && i <= f) c += s[i], s[i] = '';
								if(f + 1 < i) throw new Error("");
								s[i] = ((op[c]) ? op[c] : c) + ' ';
								break;
							case '|':
								s.splice(i);
								imp = iap + i + 1;
								break outerloop;
						};
					};
					s = s.join('');
					break;
				default:
					outerloop:
					for(i=0,f=s.length;i<=f;i++)
					{
						switch(s[i])
						{
							case ' ':
							case '\t':
							case '\r':
							case '\n':
								s[i++] = ',';
								while(s[i] <= ' ') s[i++] = '';
								break;
							case '$':
								s[i] = '&&__COM__::__VAR__&&';
								break;
							case '=':
								s[i] = ':';
								break;
							case '"':
							case "'":
								c = s[i++];
								while(s[i] != c && i <= f) ++i;
								if(f < i) throw new Error("");
								if(s[i-1] == '\\') i--;
								break;
							case '|':
								s.splice(i);
								imp = iap + i + 1;
								break outerloop;
						};
					};
					s = '{' + s.join('') + '}';
					break;
			};

			this.attr = s;
		};

		if(-1 < imp)
		{
			c = false;
			s = src.slice(imp).split('');
			for(i=0,f=s.length;i<=f;i++)
			{
				switch(s[i])
				{
					case '$':
						s[i] = '&&__COM__::__VAR__&&';
						break;
					case '"':
					case "'":
						c = s[i++];
						while(s[i] != c && i <= f) i++;
						if(f + 1 < i) throw new Error("");
						if(s[i-1] == '\\') i--;
						break;
					case ':':
						s[i] = (c) ? ',' : '":[,';
						c = true;
						break;
					case '|':
						s[i] = (c) ? '],"' : '":[],"';
						c = false;
						break;
				};
			};
			s[i] = (c) ? '' : '":[';
			this.modif = '{"'+ s.join('') +']}';
		};
	},
	toString : function()
	{
		var temp;

		switch(this.symbol)
		{
			case '"':
			case "'":
			case '$':
				return 'self.inModif('+ this.modif +','+ this.name +');\n';
			case '/':
				switch(this.name)
				{
					case 'if':
						return '}';
					case 'strip':
						return 'return B.join("");}()).replace(/\\s|\\n/g,"");';
					case 'foreach':
					case 'section':
						return 'return B.join("");});\n';
				};
				return 'return B.join("");}());\n';
			case '#':
			case '*':
				return '""';
		};

		switch(this.name)
		{
			case 'if':
				return 'if('+ this.attr +'){';
			case 'else':
				return '}\nelse{';
			case 'elseif':
				return '}\nelse if('+ this.attr +'){';
			case 'ldelim':
				return 'self.left_delimiter;';
			case 'rdelim':
				return 'self.right_delimiter;';
			case 'strip':
				return 'String(function(){var B=[],I=-1;';
			case 'javascript':
				return 'self.inEval(';
			case 'sectionelse':
			case 'foreachelse':
				return ';return B.join("");},function(){var B=[],I=-1;';
			case 'literal':
				return 'self.inModif(' + this.modif + ',function(){var B=[],I=-1;';
			case 'foreach':
				return 'self.inForeach('+ this.attr +','+ this.modif +',function(){var B=[],I=-1;';
			case 'section':
				temp = JSmarty.Compiler.extract(this.attr, 'name');
				this.attr = JSmarty.Compiler.remove(this.attr, 'name');
				if(temp == '') throw new Error("section : missing 'name' parameter");
				return 'self.inSection("'+ temp +'",'+ this.attr +','+ this.modif +',function('+ temp +'){var B=[],I=-1;';
		};

		temp = (this.isFunction()) ? ');\n' : ',function(){var B=[],I=-1;\n';
		return 'self.inCall("'+ this.name +'",'+ this.attr +','+ this.modif + temp;
	},
	isClose : function(){ return (this.symbol == '/'); },
	isFunction : function(){ return (this.type == 'function'); },
	getProperty : function(key){ return this[key]; },
	setProperty : function(key, value){ if(key in this) this[key] = value; }

};

/**
 * extract function
 * @param {String} src source
 * @param {String} key
 * @return {mixed}
 */
JSmarty.Compiler.extract = function(src, key)
{
	var res = src.match(RegExp(key + ':([^,}]+)'));
	return (res) ? res[1] : '';
};

/**
 * remove function
 * @param {String} src source
 * @param {String} key
 * @return {String}
 */
JSmarty.Compiler.remove = function(src, key)
{
	return src.replace(RegExp(key + ':([^,]+),'),'');
};

/** StringBuffer **/
JSmarty.Compiler.StringBuffer = function()
{
	var p = -1, b = [];
	this.apend     = function(s){ b[++p] = s; };
	this.toString  = function(s){ return b.join(''); };
};

/** String Operators **/
JSmarty.Compiler.OPERATORS =
{
	eq : '==', ne : '!=', neq: '!=', gt : '>' ,
	lt : '<' , ge : '>=', gte: '>=', le : '<=',
	lte: '<=', not: '!' , and: '&&', or : '||',
	mod: '%'
};