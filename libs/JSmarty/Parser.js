JSmarty.Parser = function(){};

JSmarty.Parser.BELEMNT = {};
JSmarty.Parser.MAPFILT = {
	pre:'Prefilter', post:'Postfilter', output:'Outputfilter'
};
JSmarty.Parser.REXPARM = new RegExp('(\\w+)=(\'|\"|)([^\\s]+|[^\\2]+?)\\2','g');
JSmarty.Parser.toParam = function()
{
	
};

JSmarty.Parser.prototype =
{
	autoload_filters:{},

	left_delimiter: '{',
	right_delimiter:'}',

	_tpl_vars:{},
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
	src= this._filter(src, 'output');

	return src;
}
/** parser **/
JSmarty.Parser.prototype.parser = function(src)
{
	var tag, res, rex, isp, iep, ibp = 0, txt = '', name;
	var L = this.left_delimiter, R = this.right_delimiter;
	var count = 0, flag = false, fin = src.lastIndexOf(R);

	for(var i=0;i<fin;i=iep+R.length)
	{
		isp = src.indexOf(L, i), iep = src.indexOf(R, i);
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

		switch(res.type)
		{
			case 'block':
				ibp = iep + R.length;
				name= res.src, flag = true;
				tag = src.slice(isp + L.length, iep);
				txt += src.slice(i, isp);
				break;
			default:
				txt += src.slice(i, isp) + res.src;
				break;
		}
	}

	return txt + src.slice(i);
};
// -- par
JSmarty.Parser.prototype._par = function(src)
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
/** _tag **/
JSmarty.Parser.prototype._tag = function(src, cnt, name)
{
	var ipp = src.indexOf(' '), imp = src.indexOf('|');
	var mod, par = {}, iep = src.length, list = JSmarty.Parser.BELEMNT;

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
			src = this._var(src.slice(1,iep));
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

	if(imp >= 0)
		src = this._modifier(src, mod);

	return {src:src, type:'var'};
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
	var i, list;

	if(list = this.autoload_filters[type])
	{
		type = JSmarty.Parser.MAPFILT[type];
		for(i in list)
			src = this._plugin(list[i], src, type);
	}

	return src;
};
/** _modifier **/
JSmarty.Parser.prototype._modifier = function(src, mod)
{
	var i, name, parm;

	mod = mod.split('|');

	for(i=mod.length-1;i>=0;i--)
	{
		parm = mod[i].split(':');
		name = parm.shift();
		parm.unshift(src);

		if(name == 'default')
			name = name + 's';

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