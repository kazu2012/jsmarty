JSmarty.Parser = function(){};

JSmarty.Parser.BELEMNT = {};
JSmarty.Parser.MAPFILT = {
	pre:'Prefilter', post:'Postfilter', output:'Outputfilter'
};
JSmarty.Parser.REXPARM = new RegExp('(\\w+)=(\'|\"|)([^\\s]+|[^\\2]+?)\\2','g');

JSmarty.Parser.prototype =
{
	autoload_filters:{},

	left_delimiter: '{',
	right_delimiter:'}',

	_tpl_vars:{},
	_foreach:{},
	_section:{},
	_plugins:
	{
		Modifier: {}, Function:  {}, Block:       {},
		Prefilter:{}, Postfilter:{}, Outputfilter:{},
		Resource: {}, Insert:    {}, Compiler:    {}
	}
};
/** exec **/
JSmarty.Parser.prototype.exec = function(src)
{
	var res, rex, list;
	var L = this.left_delimiter, R = this.right_delimiter;

	rex  = new RegExp(L+'\\/(.+?)'+R,'g');
	list = JSmarty.Parser.BELEMNT;

	while(res = rex.exec(src)){
		list[res[1]] = true;
	}

	src = this._filter(src, 'pre');
	src = this.parser(src);
	src = this._filter(src, 'post');
	src = this._filter(src, 'output');

	return src;
}
/** parser **/
JSmarty.Parser.prototype.parser = function(src)
{
	var isp, iep, ipp, imp, inp, ibp, irp;
	var L = this.left_delimiter, R = this.right_delimiter;
	var n = 0, l = L.length, r = R.length, nested = false;
	var txt = '', S = ' ', M = '|', list = JSmarty.Parser.BELEMNT;

	for(var i=0,fin=src.lastIndexOf(R);i<fin;i=iep+r)
	{
		isp = src.indexOf(L,i)+l, iep = src.indexOf(R,i);

		if(nested)
		{
			switch(src.indexOf(name, isp))
			{
				case isp:
					break;
				case isp+1:
					if(name == 'if')
						name += 's', parm = src.slice(ipp+1, irp);
					txt += this._plugin(name, parm, src.slice(ibp, isp-l), 'Block');
					break;
				default:
					break;
			}

			continue;
		}

		inp = irp = iep;
		ipp = src.indexOf(S,isp), imp = src.indexOf(M,isp);
		if(modf = (imp < iep && imp != -1)) inp = imp, irp = imp;
		if(parm = (ipp < iep && ipp != -1)) inp = ipp;

		txt += src.slice(i, isp-l);

		switch(src.charAt(isp))
		{
			case '*': break;
			case '#': break;
			case '$':
				txt += this._var(src.slice(isp+1, inp));
				break;
			default:
				name = src.slice(isp, inp);
				parm = (parm) ? this._param(src.slice(ipp+1, irp)) : {};
				if(nested = list[name])
					ibp = iep+r;
				else
					txt += this._plugin(name, parm, null, 'Function');
				break;
		}
	}

	return txt + src.slice(i);
};
// -- par
JSmarty.Parser.prototype._param = function(src)
{
	var res, obj = {}, rex = JSmarty.Parser.REXPARM;

	while(res = rex.exec(src))
	{
		if('$' == res[3].charAt(0))
			obj[res[1]] = this._var(res[3].slice(1));
		else
			obj[res[1]] = res[3];
	}

	return obj;
};
/** _var **/
JSmarty.Parser.prototype._var = function(src, array)
{
	if(!array) array = this._tpl_vars;

	if(typeof src == 'string')
	{
		if(src.split('.').length > 1)
			return this._var(src, array[src.split('.')[0]]);
		return array[src];
	}

	if(src[0].split('.').length > 1)
		return this._var(src, array[src[0].split('.')[0]]);

	return array[src[0]];
};
/** _filter **/
JSmarty.Parser.prototype._filter = function(src, type)
{
	var list;

	if(list = this.autoload_filters[type])
	{
		type = JSmarty.Parser.MAPFILT[type];
		for(var i in list)
			src = this._plugin(list[i], src, type);
	}

	return src;
};
/** _modifier **/
JSmarty.Parser.prototype._modifier = function(src, mod)
{
	var name, parm;

	mod = mod.split('|');

	for(var i=mod.length-1;i>=0;i--)
	{
		parm = mod[i].split(':');
		name = parm.shift();
		parm.unshift(src);

		if(name == 'default') name += 's';
		src = this._plugin(name, parm, null, 'Modifier');
	}

	return src;
};
/** plugin **/
JSmarty.Parser.prototype._plugin = function(name, parm, src, type)
{
	var plugin = this._plugins[type][name];

	if(plugin == void(0))
		plugin = JSAN.require('JSmarty.'+ type +'.'+ name);
	if(!plugin) return '';

	switch(type)
	{
		case 'Prefilter':
		case 'Postfilter':
		case 'Outputfilter':
			return plugin(src, this);
		case 'Function':
			return plugin(parm, this);
		case 'Block':
			return plugin(parm, src, this);
		case 'Modifier':
			return plugin.apply(null, parm);
	}
};