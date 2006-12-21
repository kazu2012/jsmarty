/**
 *
 * LICENCE:
 *
 * @author shogo < shogo4405 at gmail dot com>
 * @version 0.2.0
 */

JSmarty.Compiler = function(renderer)
{
	var Tags = [], Block = {};

	var L = renderer.left_delimiter;
	var R = renderer.right_delimiter;

	var VarRegExp = /\$/;
	var RcrRegExp = /\r?\n/g;
	var RmvRegExp = /\+\)/g;
	var RsvRegExp = /\$smarty\./;
	var BlcRegExp = RegExp(L + '\\/(.*?)' + R,'g');
	var TagRegExp = RegExp(L + '[^'+ R +']+' + R,'g');
	var TknRegExp = /eq|ne|neq|gt|lt|ge|gte|le|lte|not|and|or/g;

	var Plugin = JSmarty.Plugin, Compiler = JSmarty.Compiler;
	var PutString = null, StringBuffer = Compiler.StringBuffer;
	var Module = Compiler.Module, OPERATORS = Compiler.OPERATORS;

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
		var r = m = new Module(src);
		var n = m.name, s = m.symbol;

		if(0 < Tags.length)
		{
			if(Block[n])
			{
				if(s == '/') Tags.pop();
				else         Tags.push(n);
			};

			switch(Tags[0])
			{
				case 'literal':
					return genString(L + src + R);
			};

			if(0 < Tags.length) r += '+';
		}
		else
		{
			PutString('B[++I]=');
			if(Block[n])
			{
				Tags.push(n);
				r = m.toString(true);
			};
		};

		PutString(r);
	};
	/**
	 * GenModule function
	 * @param  {String} s source
	 * @return {String}
	 */
	function genString(s)
	{
		if(s && -1 < s.indexOf('"')) s = s.split('"').join('\\"');
		(Tags.length == 0) ? PutString(';\nB[++I]="'+ s + '";\n') : PutString('"'+ s + '"+');
	};
	/**
	 * header function
	 */
	function header()
	{
		PutString('var I=-1,B=[],O={},V=this._tpl_vars');
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
		while((r = p.exec(src)) != null) Block[r[1]] = true;

		// scan tag element and string
		p = TagRegExp;
		while((r = p.exec(src)) != null)
		{
			tag = r[0]; isp = src.indexOf(tag, iap);
			genString(src.slice(iap, isp));
			genModule(tag.slice(ilp, irp));
			iap = isp + tag.length;
		};

		genString(src.slice(iap));
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
	name : null, attr : 'O', modif : null, symbol : null,
	parse : function(src)
	{
		var s, i, f, iap = -1, imp = -1;
		var inp = src.length, c = src.charAt(0);

		switch(c)
		{
			case '"':
			case "'":
				this.name = src.slice(1, inp++);
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
				isp = src.indexOf('smarty');
				this.name = (-1 < isp) ? 'this._' : 'V.';
				this.name += src.slice((-1 < isp) ? isp + 7 : 1, (-1 < imp) ? imp++ : inp);
				this.symbol = c;
				break;
			case '/':
				this.name = src.slice(1);
				this.symbol = c;
				break;
			default:
				iap = src.indexOf(' ');
				imp = src.indexOf('|');
				inp = (-1 < iap) ? iap++ : (-1 < imp) ? imp++ : inp;
				this.name = src.slice(0, inp);
				this.symbol = '';
				break;
		};

		if(-1 < iap)
		{
			switch(this.name)
			{
				case 'if':
				case 'elsif':
					s = src.slice(iap).split('');
					for(i=0,f=s.length;i<=f;i++)
					{
						switch(s[i])
						{
							case '$':
								s[i++] = 'V.';
								break;
						};
					};
					s = s.join('');
					break;
				default:
					s = src.slice(iap).split('');
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
								s[i] = 'V.';
								break;
							case '=':
								s[i] = ':';
								break;
							case '"':
							case "'":
								c = s[i];
								while(s[++i] != c);
								if(s[i-1] == '\\') i--;
								break;
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
					case ':':
						s[i++] = (c) ? '"' : '';
						c = true;
						break;
					case '|':
						s[i++] = (c) ? '' : '":[],"';
						c = false;
						break;
				};
			};
			s[i] = (c) ? '' : '":[]';
			this.modif = '{"'+ s.join('') +'}';
		};
	},
	toString : function(block)
	{
		switch(this.symbol)
		{
			case '"':
			case "'":
			case '$':
				return 'this.inModif('+ this.modif +','+ this.name +')';
			case '/':
				switch(this.name)
				{
					case 'if':
						return '"";}';
					case 'strip':
						return '"").replace(/\\s|\\n/g,"")';
					case 'foreach':
					case 'section':
						return '"";return B.join("");})';
				};
				return '"")';
			case '*':
				return '';
		};

		switch(this.name)
		{
			case 'literal':
				return 'this.inModif(' + this.modif + ',';
			case 'if':
				return '"";\nif('+ this.attr +'){B[++I]=';
			case 'else':
				return '"";}\nelse{B[++I]=';
			case 'elsif':
				return '"";}\nelse if('+ this.attr +'){B[++I]=';
			case 'ldelim':
				return 'this.left_delimiter';
			case 'rdelim':
				return 'this.right_delimiter';
			case 'strip':
				return 'String(';
			case 'javascript':
				return 'this.inEval(';
			case 'sectionelse':
			case 'foreachelse':
				return '"";return B.join("");},function(){var B=[],I=-1;B[++I]=';
			case 'foreach':
				return 'this.inForeach('+ this.attr +','+ this.modif +',function(){var B=[],I=-1;B[++I]=';
			case 'section':
				return 'this.inSection('+ this.attr +','+ this.modif +',function(){var B=[],I=-1;B[++I]=';
		};

		var suffix = (block) ? ',' : ')';
		return 'this.inCall("'+ this.name +'",'+ this.attr +','+ this.modif + suffix;
	}
};

/** StringBuffer **/
JSmarty.Compiler.StringBuffer = function()
{
	var p = -1, b = [];
	this.apend     = function(s){ b[++p] = s; };
	this.toString  = function(s){ return b.join(s || ''); };
};

/** String Operators **/
JSmarty.Compiler.OPERATORS =
{
	eq : '==', ne : '!=', neq: '!=', gt : '>' ,
	lt : '<' , ge : '>=', gte: '>=', le : '<=',
	lte: '<=', not: '!' , and: '&&', or : '||'
};