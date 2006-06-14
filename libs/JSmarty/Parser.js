JSmarty.Parser = function(){};
JSmarty.Parser.prototype =
{
	autoload_filters:{},
	_tpl_vars:{},
	_plugins:
	{
		Modifier: {}, Function:  {}, Block:       {},
		Prefilter:{}, Postfilter:{}, Outputfilter:{},
		Resource: {}, Insert:    {}, Compiler:    {}
	},
	_list_block: null,
	_rex_param: new RegExp('(\\w+)=(\'|\"|)([^\\s]+|[^\\2]+?)\\2','g')
};
/** parser **/
JSmarty.Parser.prototype.parser = function(src)
{
	var tag, res, rex, isp, iep, ibp = 0, txt = '', name;
	var L = this.left_delimiter, R = this.right_delimiter;
	var count = 0, flag = false;

	if(!this._list_block)
	{
		rex = new RegExp(L+'\\/(.+?)'+R,'g')
		src = this._filter(src,'pre'), this._list_block = {};
		while(res = rex.exec(src)) this._list_block[res[1]] = true;
	}

	for(var i=0;i<src.lastIndexOf(R);i=iep+R.length)
	{
		isp = src.indexOf(L, i);
		iep = src.indexOf(R, i);
		res = this._tag(src.slice(isp + L.length, iep), null, flag);

		if(flag)
		{
			switch(res.src)
			{
				case name:
					count++;
					break;
				case '/'+ name:
					flag = false;
					txt += this._tag(tag, src.slice(ibp, isp))['src'];
					break;
			}
			continue;
		}

		txt += src.slice(i, isp);

		switch(res.type)
		{
			case 'block':
				ibp = iep + R.length;
				name= res.src, flag = true;
				tag = src.slice(isp + L.length, iep);
				break;
			default:
				txt += res.src;
				break;
		}
	}

	return (rex) ? this._filter(txt + src.slice(i), 'post') : txt + src.slice(i);
};
// -- par
JSmarty.Parser.prototype._par = function(src)
{
	var res, obj = {}, rex = this._rex_param;

	while(res = rex.exec(src))
	{
		if('$' == res[3].charAt(0))
			obj[res[1]] = this._tpl_vars[res[3]];
		else
			obj[res[1]] = res[3];
	}

	return obj;
};
/** _tag **/
JSmarty.Parser.prototype._tag = function(src, cnt, name)
{
	var ipp = src.indexOf(' '), imp = src.indexOf('|');
	var mod, par = {}, iep = src.length, list = this._list_block;

	if(imp >= 0)
		mod = src.slice(imp+1), iep = imp;
	if(ipp >= 0)
		par = this._par(src.slice(ipp+1)), iep = ipp;

	if(name)
		return {src:src.slice(0,iep), type:'name'};

	switch(src.charAt(0))
	{
		case '*':
			return {src:'', type:'comment'};
		case '$':
			src = this._var(src.slice(0,iep));
			break;
		case '#':
			src = '';
			break;
		default:
			src = src.slice(0, iep);
			if(list[src] && !cnt) return {src:src, type:'block'};
			src = this._plugin(src, par, cnt, (cnt) ? 'Block' : 'Function');
			break;
	}

	return {src:this._modifier(src, mod), type:'var'};
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
	var list = this.autoload_filters[type];

	if(list)
	{
		type = type.charAt(0).toUpperCase() + type.slice(1) + 'filter';
		for(var i in list) src = this._plugin(list[i], src, type);
	}

	return src;
};
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
};
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
};