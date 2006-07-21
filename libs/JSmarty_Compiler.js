JSmarty_Compiler = function(smarty){
	this.smarty = smarty || null;
};

JSmarty_Compiler.prototype =
{
	SQUOT : '"',
	SSPAC : ' ',
	SSPRT : '|',
	SVARS : 'vars.',
	SOTPT : 'output += ',
	SFOOT : '"";\nreturn otpt;',
	SHEAD : 'var otpt, vars = this._tpl_vars, func = "function",'+
			'blck = "block";\notpt = ""',
	RBLCK : new RegExp(),
	RPARM : new RegExp('(\\w+)=(\'|\"|)([^\\s]+|[^\\2]+?)\\2','g')
};

JSmarty_Compiler.prototype.compile = function(src)
{
	var isp, iep, icp, ipp, imp, inp, ibp, irp;
	var L = "{", R = "}";
	var l = L.length, r = R.length, nested = false;
	var txt = [], list = JSmarty.BELEMENT;
	var Q = this.SQUOT, S = this.SSPAC, M = this.SSQRT;

	txt.push(this.SHEAD);

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
		if(imp < iep && imp != -1) inp = imp, irp = imp;
		if(ipp < iep && ipp != -1) inp = ipp;

		switch(src.charAt(isp))
		{
			case '*': break;
			case '#':
			//	txt.push();
				break;
			case '$':
				txt.push(this.toVar(src.slice(isp + 1, iep)));
				break;
			default:
				name = src.slice(isp, inp);
				parm = src.slice(ipp + 1, irp);
				txt.push(this.toTag(name, parm, null));
				break;
		}
	}

	txt.push(src.slice(i) + this.SFOOT);
	return txt.join(' + ');
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
	var type, Q = this.SQUOT;

	src  = (src) ? this.compile(src) : null;
	parm = this.toParm(parm);
	type = (src) ? 'block': 'func';

	switch(name)
	{
		case 'ldelim':
			return 'this.left_delimiter';
		case 'rdelim':
			return 'this.right_delimiter';
		default:
			name = Q + name + Q;
			return 'this._plugin('+ name +','+ parm +','+ src +','+ type +')';
	}
};