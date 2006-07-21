JSmarty_Compiler = function(){};
JSmarty_Compiler.prototype =
{
	SQUOT : '"',
	SSPAC : ' ',
	SSPRT : '|',
	SPROD : ', ',
	SVARS : 'vars.',
	SOTPT : 'output += ',
	SFOOT : '"";\nreturn output;',
	SFUNC : 'function(){',
	SPGIN : 'this._plugin(',
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
JSmarty_Compiler.prototype.compile = function(src)
{
	var list = this._holded_blocks;
	var isp, iep, icp, ipp, imp, inp, ibp, irp;
	var Q = this.SQUOT, S = this.SSPAC, M = this.SSPRT;
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
			txt.push(Q + src.slice(i, icp) + Q);

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

	return txt.join(" + ");
};
JSmarty_Compiler.prototype.toVar = function(src){
	return this.SVARS + src;
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
		case 'if':
			var head, foot;
			parm = this.toExp(parm);
			head = this.SHEAD, foot = this.SFOOT;
			this.SHEAD = '', this.SFOOT = '';
			src = this.toIfThen('if', parm, this.compile(src))
			this.SHEAD = head, this.SFOOT = foot;
			return src;
		case 'else':
		case 'elsif':
			parm = this.toExp(parm);
			return this.toIfThen(name, parm);
		case 'ldelim':
			return this.toString(this.left_delimiter);
		case 'rdelim':
			return this.toString(this.right_delimiter);
		case 'literal':
			return this.toString(src);
		default:
			parm = this.toParm(parm);
			name = this.toString(name);
			src  = this.toFunction(src);
			return this.toPlugin(name, parm, src);
	}
};
JSmarty_Compiler.prototype.toExp = function(src)
{
	src = src.replace(this.RVARS, this.SVARS);
	return src;
};
JSmarty_Compiler.prototype.toIfThen = function(name, parm, src)
{
	switch(name)
	{
		case 'if':
			return '"";\nif('+ parm +'){output += ""'+ src +'"";}\noutput += ""';
		case 'elsif':
			return '"";}\nelse if('+ parm +'){ output += ""';
		case 'else':
			return '"";}\nelse{ output += ""';
	}
};
JSmarty_Compiler.prototype.toPlugin = function(name, parm, src)
{
	var type = (src) ? 'blck' : 'func', P = this.SPROD;
	return this.SPGIN + name + P + parm + P + src + P + type +')';
};
JSmarty_Compiler.prototype.toString = function(src)
{
	if(!src) return '';
	return this.SQUOT + src + this.SQUOT;
};
JSmarty_Compiler.prototype.toInclude = function(parm)
{
};
JSmarty_Compiler.prototype.toFunction = function(src)
{
	if(!src) return null;
	return this.SFUNC + this.compile(src) +'}';
};