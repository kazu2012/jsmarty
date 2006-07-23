JSmarty_Compiler = function(){};
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
	_holded_blocks : {}
};
JSmarty_Compiler.prototype.JSmarty_Compiler = function(smarty)
{
	var res, rex = this.RBLCK, list = this._folded_blocks;
	var L = this.left_delimiter, R = this.right_delimiter;

	rex.exec(L + '\\/(.+?)' + R,'g');
	while(res = rex.exec(src)) list[res[1]] = true;
}
JSmarty_Compiler.prototype.exec = function(src, option)
{
	var isp, iep, icp, ipp, imp, inp, ibp, irp;
	var S = ' ', M = '|', list = this._holded_blocks;
	var L = this.left_delimiter , R = this.right_delimiter;
	var l = L.length, r = R.length, nested = false, txt = [];

	txt.push(this.SHEAD);
	src = src.replace(this.RCRLF,'\\n');

	for(var i=0,fin=src.lastIndexOf(R);i<fin;i=iep+r)
	{
		isp = src.indexOf(L, i)+l, iep = src.indexOf(R, i);

		if(nested)
		{
			switch(src.indexOf(name, isp))
			{
				case isp+1:
					txt.push(this.toTag(name, parm, src.slice(ibp, isp-l)));
					nested = false;
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
			case '#':
			//	txt.push(this.toVar(src.slice()));
				break;
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

	txt.push(this.SFOOT);

	return txt.join(" + ").replace(/"" \+|(\+ "")/g,'');
};
JSmarty_Compiler.prototype.setHeader = function()
{
};
JSmarty_Compiler.prototype.setFooter = function()
{
};
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
			var head, foot;
			head = this.SHEAD, foot = this.SFOOT;
			parm = this.toValue(parm);
			this.SHEAD = '', this.SFOOT = '';
			src = '"";\nif('+ parm +'){ output += ""'+ this.exec(src) +'"";}\noutput += ""';
			this.SHEAD = head, this.SFOOT = foot;
			return src;
		case 'literal':
			return this.toString(src);
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
JSmarty_Compiler.prototype.toVar = function(src)
{
	var prefix = 'vars.';
	return prefix + src;
};
JSmarty_Compiler.prototype.toVar2 = function()
{
	if(!src) return '';
	var prefix = 'vars.' : 'svar.';
	return 'this._var('+ prefix + src + ')';
};
JSmarty_Compiler.prototype.toValue = function(src)
{
	src = src.replace(this.RVARS, 'vars.');
	return src;
};
JSmarty_Compiler.prototype.toPlugin = function(name, parm, src)
{
	var P = ', ', type = (src) ? 'blck' : 'func';
	return 'this._plugin(' + name + P + parm + P + src + P + type + ')';
};
JSmarty_Compiler.prototype.toString = function(src)
{
	if(!src) return '';
	return '"' + src + '"';
};
JSmarty_Compiler.prototype.toFunction = function(src)
{
	if(!src) return null;
	return 'function(){' + this.exec(src) + '}';
};