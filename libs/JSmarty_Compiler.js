/**
 * Template compiling class
 * @package JSmarty
 */
function JSmarty_Compiler(){};

JSmarty_Compiler.prototype =
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
	_is_defaultmod : null
};
JSmarty_Compiler.prototype.JSmarty_Compiler = function(src, smarty)
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
JSmarty_Compiler.prototype.exec = function(src, mode)
{
	var isp, iep, icp, ipp, imp, inp, ibp, irp;
	var S = ' ', M = '|', list = this._folded_blocks
	var L = this.left_delimiter , R = this.right_delimiter;
	var l = L.length, r = R.length, nested = false, txt = [];
	var name, modf, parm;

	switch(mode)
	{
		case 'if':
		case 'function':
			break;
		default:
			src = src.replace(this.RCRLF,'\\n');
			break;
	}

	for(var i=0,fin=src.lastIndexOf(R);i<fin;i=iep+r)
	{
		isp = src.indexOf(L, i)+l, iep = src.indexOf(R, i);

		if(nested)
		{
			switch(src.indexOf(name, isp))
			{
				case isp+1:
					txt.push(this.toTag(name, parm, src.slice(ibp, isp-l)));
					if(modf && !(nested = false))
						txt[txt.length-1] = this.toModf(txt[txt.length-1], this.toString(src.slice(imp+1, ibp-r)));
					break;
				default:
					break;
			}
			continue;
		}

		if(i != (icp = isp-l))
			txt.push(this.toString(src.slice(i, icp)));

		inp = irp = iep;
		ipp = src.indexOf(S,isp), imp = src.indexOf(M,isp);
		if(modf = (imp < iep && imp != -1)) inp = imp, irp = imp;
		if(parm = (ipp < iep && ipp != -1)) inp = ipp;

		switch(src.charAt(isp))
		{
			case '*': break;
			case '#': break;
			case '$':
				txt.push(this.toVar(src.slice(isp + 1, iep)));
				break;
			default:
				name = src.slice(isp, inp);
				parm = (parm) ? src.slice(ipp + 1, irp) : '';
				if(nested = list[name]) ibp = iep + r;
				else txt.push(this.toTag(name, parm, null));
				break;
		}
	}

	if(i != src.length)
		txt.push(this.toString(src.slice(i)));

	switch(mode)
	{
		case 'if':
			return txt.join(" + ");
		default:
			txt.unshift(this.SHEAD);
			txt.push(this.SFOOT);
			return txt.join(" + ").replace(/"" \+|(\+ "")/g, '');
	}
};
/**
 * toTag
 *
 * @param  string
 * @param  string
 * @param  string
 * @return string
 */

JSmarty_Compiler.prototype.toTag = function(name, parm, src)
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
JSmarty_Compiler.prototype.toJSmartyVars = function(src)
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
JSmarty_Compiler.prototype.toFunction = function(src)
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
 JSmarty_Compiler.prototype.toString = function(src)
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
JSmarty_Compiler.prototype.toPlugin = function(name, parm, src)
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
JSmarty_Compiler.prototype.toValue = function(src)
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
JSmarty_Compiler.prototype.toVar = function(src){
	return 'vars.'+ src;
};

/**
 * String to modifier
 *
 * @param  string
 * @param  string
 * @return string
 */
JSmarty_Compiler.prototype.toModf = function(src, modf){
	return 'this._modf('+ src +','+ modf +')';
};

/**
 * String to parameter
 *
 * @param  string
 * @return string
 */
JSmarty_Compiler.prototype.toParm = function(src)
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