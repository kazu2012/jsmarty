JSmarty.Parser = function(){};
JSmarty.Parser.prototype =
{
	_tpl_vars:{},
	_plugins:
	{
		Modifier: {}, Function:  {}, Block:       {},
		Prefilter:{}, Postfilter:{}, Outputfilter:{},
		Resource: {}, Insert:    {}, Compiler:    {}
	},
	_blocklist: null,
	_rex_par: new RegExp('(\\w+)=(\'|\"|)([^\\s]+|[^\\2]+?)\\2','g')
};
/** parser **/
JSmarty.Parser.prototype.parser = function(src)
{
	var tag, res, rex, isp, iep, ibp = 0, txt = '', name;
	var L = this.left_delimiter, R = this.right_delimiter;
	var count = 0, flag = false, blocks = this._blockElements;

	if(!blocks)
	{
		rex = new RegExp(L+'\\/(.+?)'+R,'g');
		src = this._filter(src,'pre'), blocks = {};
		while(res = rex.exec(src)) blocks[res[1]] = true;
		this._blockElements = blocks;
	}

	for(var i=0;i<src.lastIndexOf(R);i=iep+R.length)
	{
		isp = src.indexOf(L, i);
		iep = src.indexOf(R, i);
		res = src.slice(isp + L.length, iep);

		if(flag)
		{
			switch(this._tag(res, 'name'))
			{
				case name:
					count++;
					break;
				case 'else':
					break;
				case 'elsif':
					break;
				case '/if':
					break;
				case '/'+ name:
					flag = false;
					txt += this._func(tag, src.slice(ibp, isp));
					break;
			}
			continue;
		}

		txt += src.slice(i, isp);
		name = this._tag(res, 'name');

		if(blocks[name])
			flag = true, ibp = iep + R.length, tag = res;
		else
			txt += this._func(res);
	}

	return (rex) ? this._filter(txt + src.slice(i), 'post') : txt + src.slice(i);
};
// -- par
JSmarty.Parser.prototype._par = function(src)
{
	var res, obj = {}, rex = this._rex_par;

	while(res = rex.exec(src))
	{
		if('$' == res[3].charAt(0))
			obj[res[1]] = this._tpl_vars[res[3]];
		else
			obj[res[1]] = res[3];
	}

	return obj;
}
/** _tag **/
JSmarty.Parser.prototype._tag = function(src, key)
{
	var iep = src.length;
	var ipp = src.indexOf(' '), imp = src.indexOf('|');
	var obj = { mod:'', name:src, param:'', type: src.charAt(0)};

	if(imp >= 0)
		obj.mod = src.slice(imp+1), iep = imp
	
	{
		t.mod  = src.slice(imp+1);
		t.name = sr
	if(ipp >= 0)
	{
		t.name = src.slice(0,ipp);
		t.param= this._par(src.slice(ipp+1));
	}

	return obj;
}
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
}
/** _filter **/
JSmarty.Parser.prototype._filter = function(src, type)
{
/*	var auto = this.autoload_filters[type];

	if(auto)
	{
		type = type.charAt(0).toUpperCase() + type.slice(1) + 'filter';
		for(var i in auto) src = this._plugin(auto[i], src, type);
	}
*/
	return src;
}
/** _modifier **/
JSmarty.Parser.prototype._modifier = function(src, mod)
{
	if(!mod) return src;

	mod = mod.split('|');

	for(var i=0;i<mod.length;i++)
	{
		par = mod[i].split(':');
		switch(par[0])
		{
			case 'default':
				par[0] = par[0] + 's';
				break;
		}
		src = this._plugin(par[0], par.slice(1), src, 'Modifier');
	}

	return src;
}
/** _func **/
JSmarty.Parser.prototype._func = function(src, cnt)
{
	var t = this._tag(src);

	switch(t.type)
	{
		case '*':
			return '';
		case '$':
			src = this._var(t.name);
			break;
		case '#':
			break;
		default:
			if(cnt)
				src = this._plugin(t.name, t.param,  cnt, 'Block');
			else
				src = this._plugin(t.name, t.param, null, 'Function');
			break;
	}

	return this._modifier(src, t.mod);
}
/** plugin **/
JSmarty.Parser.prototype._plugin = function(name, par, src, type)
{
	var plugin = this._plugins[type];

	if(plugin[name] == void(0))
		plugin[name] = JSAN.require('JSmarty.'+ type +'.'+ name);
	if(!plugin[name]) return '';

	switch(type)
	{
		case 'Prefilter':
		case 'Postfilter':
		case 'Outputfilter':
			return plugin[name](src, this);
		case 'Function':
			return plugin[name](par, this);
		case 'Block':
			return plugin[name](par, src, this);
		case 'Modifier':
			par.unshift(src);
			return plugin[name].apply(null, par);
	}
}