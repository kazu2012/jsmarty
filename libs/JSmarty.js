////////////////////////////////////////////////////////////////////////
JSmarty = function(){};
JSmarty.Block = {};
JSmarty.Shared = {};
JSmarty.Insert = {};
JSmarty.Modifier = {};
JSmarty.Compiler = {};
JSmarty.Resource = {};
JSmarty.Function = {};
JSmarty.Prefilter = {};
JSmarty.Postfilter = {};
JSmarty.Outputfilter = {};
/////////////////////////////////////////////////////////**NAME SPACES**
JSAN.use('JSmarty.Shared.Ajax');
////////////////////////////////////////////////////////////**INCLUDES**
JSmarty.AUTHOR	= 'shogo';
JSmarty.VERSION = 'dev0.0.1';
JSmarty.LICENSE = 'LGPL';

JSmarty.prototype =
{
	debugging : false,
	template_dir : './templates/',
	left_delimiter : '{',
	right_delimiter : '}',
	autoload_filters: {},
	_xmlhttp: new JSmarty.Shared.Ajax(),
	_result:'',
	_tpl_vars:{},
	_plugins:
	{
		Modifier: {}, Function:  {}, Block:       {},
		Prefilter:{}, Postfilter:{}, Outputfilter:{},
		Resource: {}, Insert:    {}, Compiler:    {}
	},
	$smarty:'',
	_smarty_vars:
	{
		get:{},
		foreach: {}, sections:{}, capture:{},
		ldelim : this.left_delimiter, rdelim: this.right_delimiter,
		version: JSmarty.VERSION, template: ''
	},
	_blockElements:null,
	_pattern: new RegExp('(\\w+)=(\'|\"|)([^\\s]+|[^\\2]+?)\\2','g')
}
/* --------------------------------------------------------------------
 # Parser
 -------------------------------------------------------------------- */
/** _param **/
JSmarty.prototype._param = function(src)
{
	var res, rex = this._pattern, p = {};

	while(res = rex.exec(src))
	{
		if('$' == res[3].charAt(0))
			p[res[1]] = this._tpl_vars[res[3]];
		else
			p[res[1]] = res[3];
	}

	return p;
}
/** _tag **/
JSmarty.prototype._tag = function(src, key)
{
	var t = { mod:'', name:src, param:'' };
	var ipp = src.indexOf(' '), imp = src.indexOf('|');

	if(imp >= 0)
	{
		t.mod  = src.slice(imp+1);
		t.name = src.slice(0,imp);
	}
	if(ipp >= 0)
	{
		t.name = src.slice(0,ipp);
		t.param= this._param(src.slice(ipp+1));
	}

	return (key) ? t[key] : t;
}
/** _var **/
JSmarty.prototype._var = function(src, array)
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
JSmarty.prototype._filter = function(src, type)
{
	var auto = this.autoload_filters[type];

	if(auto)
	{
		type = type.charAt(0).toUpperCase() + type.slice(1) + 'filter';
		for(var i in auto) src = this._plugin(auto[i], src, type);
	}

	return src;
}
/** _modifier **/
JSmarty.prototype._modifier = function(src, mod)
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
/** _plugin **/
JSmarty.prototype._plugin = function(name, param, src, type)
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
			return plugin[name](param, this);
		case 'Block':
			return plugin[name](param, src, this);
		case 'Modifier':
			param.unshift(src);
			return plugin[name].apply(null, param);
	}
}
/** _func **/
JSmarty.prototype._func = function(src, cnt)
{
	var t = this._tag(src);

	switch(t.name.charAt(0))
	{
		case '*':
			return '';
		case '$':
			src = this._var(t.name);
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
/** parser **/
JSmarty.prototype.parser = function(src)
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

		name = this._tag(res, 'name');
		txt += src.slice(i, isp);

		if(blocks[name])
			flag = true, ibp = iep + R.length, tag = res;
		else
			txt += this._func(res);
	}

	return (rex) ? this._filter(txt + src.slice(i), 'post') : txt + src.slice(i);
}
/* --------------------------------------------------------------------
 # Template Variables
 -------------------------------------------------------------------- */
/** assign **/
JSmarty.prototype.assign = function(key, value)
{
	switch(typeof value)
	{
		case 'undefined':
			value = null;
			break;
	}

	if(typeof key == 'string')
	{
		this._tpl_vars['$'+key] = value;
		return;
	}

	for(var i in key)
	{
		if(i == '') continue;
		this._tpl_vars[i] = key[i];
	}
}
/** clear_assign **/
JSmarty.prototype.clear_assign = function(key)
{
	if(typeof key == 'string')
	{
		delete this._tpl_vars[key];
		return;
	}

	for(var i in key)
	{
		if(i == '') continue;
		delete this._tpl_vars[key[i]];
	}
}
/** clear_all_assign **/
JSmarty.prototype.clear_all_assign = function(){
	this._tpl_vars = {};
}
/** get_template_vars **/
JSmarty.prototype.get_template_vars = function(key){
	return (key) ? this._tpl_vars[key] : this._tpl_vars;
}
/* --------------------------------------------------------------------
 # Template Process
 -------------------------------------------------------------------- */
/** fetch **/
JSmarty.prototype.fetch = function(file, element, display)
{
	var eot, sot, res, xmlhttp = this._xmlhttp;

	this.$smarty.template = file;

	if(element)
	{
		xmlhttp.display(this.template_dir + file, element, this);
		return;
	}

	res = xmlhttp.file_get_contents(this.template_dir + file);
	if(this.debugging) sot =(new Date()).getTime();
	res = this.parser(res);
	if(this.debugging)
	{
		eot =(new Date()).getTime();
		alert('HTML Convert Time :\t'+ (eot-sot)/1000 +'.sec');
	}

	if(display) document.write(res);

	return res;
}
/** display **/
JSmarty.prototype.display = function(file, element){
	this.fetch(file, element, true);
}
/** templete_exists **/
JSmarty.prototype.template_exists = function(){
}
/* --------------------------------------------------------------------
 # Plugins
 -------------------------------------------------------------------- */
/** register_block **/
JSmarty.prototype.register_block = function(name, impl){
	this._plugins.Block[name] = impl;
}
/** register_function **/
JSmarty.prototype.register_function = function(name, impl){
	this._plugins.Function[name] = impl;
}
/** register_modifier **/
JSmarty.prototype.register_modifier = function(name, impl){
	this._plguins.Modifier[name] = impl;
}
/** register_compiler_function **/
JSmarty.prototype.register_compiler_function = function(name, impl){
	this._plugins.Compiler[name] = impl;
}
/** unregister_block **/
JSmarty.prototype.unregister_block = function(name){
	this._plugins.Block[name] = false;
}
/** unregister_function **/
JSmarty.prototype.unregister_function = function(name){
	this._plugins.Function[name] = false;
}
/** unregister_modifier **/
JSmarty.prototype.unregister_modifier = function(name){
	this._plugins.Modifier[name] = false;
}
/** unregister_compiler_function **/
JSmarty.prototype.unregister_compiler_function = function(name){
	this._plugins.Compiler[name] = false;
}
/* ---------------------------------------------------------------------
 # Filter
 -------------------------------------------------------------------- */
/** load_filter**/
JSmarty.prototype.load_filter = function(type, name){
}
/** register_prefilter **/
JSmarty.prototype.register_prefilter = function(name){
	this._plugins.Prefilter[name] = eval(name);
}
/** register_postfilter **/
JSmarty.prototype.register_postfilter = function(name){
	this._plugins.Postfilter[name] = eval(name);
}
/** register_outputfilter **/
JSmarty.prototype.register_outputfilter = function(name){
	this._plugins.Outputfilter[name] = false;
}
/** unregister_prefilter **/
JSmarty.prototype.unregister_prefilter = function(name){
	this._plugins.Prefilter[name] = false;
}
/** unregister_postfilter **/
JSmarty.prototype.unregister_postfilter = function(name){
	this._plugins.Postfilter[name] = false;
}
/** unregister_outputfilter **/
JSmarty.prototype.unregister_outputfilter = function(name){
	this._plugins.Outputfilter[name] = false;
}