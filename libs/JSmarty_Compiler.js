/**
 * Template compiling class
 * @package JSmarty
 */
JSmarty.Compiler = function(){ /* empty */ };

JSmarty.Compiler.STROPS =
{
	ne : '!=', eq : '==', lt : '>', gt : '<'
};

JSmarty.Compiler.prototype =
{
	SOTPT : 'output += ',
	SFOOT : '"";\nreturn output;',
	SHEAD : 'var output, vars = this._tpl_vars, func = "function",'+
			'blck = "block";\noutput = ""',
	RBLCK : new RegExp(),
	RVARS : new RegExp('\\$','g'),
	RCRLF : new RegExp('\r?\n','g'),
	RPARM : new RegExp('(\\w+)=(\'|\"|)([^\\s]+|[^\\2]+?)\\2','g'),

	left_delimiter : '{',
	right_delimiter: '}',

	_folded_blocks : {},
	_is_defaultmod : null,

	/**
	 * ToString
	 * @return string
	 */
	_string : function(src)
	{
		return "'"+ src + "'";
	},

	/**
	 * ToPlugin
	 * @return string
	 */
	_plugin : function(src)
	{
		
	},

	/**
	 * ToVariable
	 * @return string
	 */
	_variable : function()
	{
		
	},

	/**
	 * ToModifier
	 * @return string
	 */
	_modifier : function()
	{
		
	}
};
JSmarty.Compiler.prototype.Compiler = function(src, smarty)
{
	var res, rex = this.RBLCK, list = this._folded_blocks;

	var L = this.left_delimiter  = smarty.left_delimiter;
	var R = this.right_delimiter = smarty.right_delimiter;

	rex.compile(L + '\\/(.+?)' + R,'g');
	while(res = rex.exec(src)) list[res[1]] = true;
}

/**
 * compile a resource
 * 
 * @param  string
 * @param  string
 * @return string
 */
JSmarty.Compiler.prototype.exec = function(src, mode)
{
	var itp = 0, txt = [];
	var L = this.left_delimiter , R = this.right_delimiter;

	src = src.replace(this.RCRLF,'\\n');

	src.replace(new RegExp(L + '[^'+ R +']+' + R,'g'), (function(self)
	{
		var i = 0, ipp, imp, inp, irp;
		var name, attr, L = L.length, R = R.length;

		return function(tag, isp, src)
		{
			ipp = tag.indexOf(' ');
			imp = tag.indexOf('|');
			inp = irp = tag.length - R;

			if(imp > 0) inp = imp, irp = imp;
			if(ipp > 0) inp = ipp;

			// Normal Text
			txt[i++] = self._string(src.slice(itp, isp));

			switch(tag.charAt(L))
			{
				case '*': break;
				case '"':
				case "'":
					txt[i++] = self._string(tag.slice(L, inp));
					break;
				case '$':
					if(tag.indexOf('$smarty') >= 0)
						txt[i++] = self._variable(tag.slice(L, inp));
					else
						txt[i++] = self._variable(tag.slice(L, inp));
					break;
				default:
					name = tag.slice(L, inp);
					attr = tag.slice(ipp + 1, irp);
					txt[i++] = self.toTag(name, attr, null);
					break;
			};

			itp = isp + tag.length;
			return '';
		}
	})(this));

	// Normal Text
	txt.push(this._string(src.slice(itp)));

	txt.unshift(this.SHEAD);
	txt.push(this.SFOOT);

	return txt.join(" + ");
};

/**
 * ToTag
 * @return string
 */
JSmarty.Compiler.prototype._tag = function(name, attr)
{
	switch(name)
	{
		case 'literal':
			break;
	}
};

JSmarty.Compiler.prototype.toTag = function(name, parm, src)
{
	switch(name)
	{
		default:
			parm = this.toParm(parm);
			name = this.toString(name);
			src  = this.toFunction(src);
			return this.toPlugin(name, parm, src);
		case 'if':
			parm = this.toValue(parm);
			return '"";\nif('+ parm +'){ output += '+ this.exec(src, 'if') +';}\noutput += ""';
		case 'literal':
			return this.toString(src);
		case 'strip':
			return this.toString(src.replace(/\r?\n|\t?/g,''))
		case 'javascript':
			return this.toEval(src)
		case 'capture':
			return this.toString();
		case 'else':
			return '"";}\nelse { output += ""';
		case 'ldelim':
			return this.toString(this.left_delimiter);
		case 'rdelim':
			return this.toString(this.right_delimiter);
		case 'elsif':
			return '"";}\nelse if ('+ this.toValue(parm) +'){ output += ""';
	}
};

/**
 * String to JSmarty Vars
 *
 * @param  string
 * @return string|null
 */
JSmarty.Compiler.prototype.toJSmartyVars = function(src)
{
	switch(src)
	{
		case 'version':
			return this.toString(this._version);
		default:
			return this.toString();
	};
};

/**
 * String to function
 *
 * @param  string
 * @return string|null
 */
JSmarty.Compiler.prototype.toFunction = function(src)
{
	if(!src) return null;
	return 'function(){' + this.exec(src) + '}';
};

/**
 * String to quoted string
 *
 * @param  string
 * @return string
 */
 JSmarty.Compiler.prototype.toString = function(src)
{
	if(!src) return '""';
	src = src.replace(/\"/g,'\\"'); // ‰¼ŽÀ‘•
	return '"' + src + '"';
};

/**
 * String to plugin
 *
 * @param  string
 * @return srting
 */
JSmarty.Compiler.prototype.toPlugin = function(name, parm, src)
{
	var P = ', ', type = (src) ? 'blck' : 'func';
	return 'this._call(' + name + P + parm + P + src + P + type + ')';
};

/**
 * String to value of expression
 *
 * @param  string
 * @return string
 */
JSmarty.Compiler.prototype.toValue = function(src)
{
	src = src.replace(this.RVARS, 'vars.');
	return src;
}

/**
 * String to JSmarty variable
 *
 * @param  string
 * @return string
 */
JSmarty.Compiler.prototype.toVar = function(src){
	return 'vars.'+ src;
};

/**
 * String to modifier
 *
 * @param  string
 * @param  string
 * @return string
 */
JSmarty.Compiler.prototype.toModf = function(src, modf){
	return 'this._modf('+ src +','+ modf +')';
};

/**
 * String to parameter
 *
 * @param  string
 * @return string
 */
JSmarty.Compiler.prototype.toParm = function(src)
{
	var res, obj = [], rex = this.RPARM;

	while(res = rex.exec(src))
	{
		if('$' == res[3].charAt(0))
			obj.push(res[1] +':'+ this.toVar(res[3].slice(1)));
		else
			obj.push('"'+ res[1] +'"' +':'+ res[2] + res[3] + res[2]);
	}

	return '{'+ obj.join(',') +'}';
};