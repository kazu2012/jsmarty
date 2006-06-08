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
	var res, rex = this._pattern, attr = [];

	while(res = rex.exec(src))
	{
		if('$' == res[3].charAt(0))
			attr[res[1]] = this._tpl_vars[res[3]];
		else
			attr[res[1]] = res[3];
	}

	return attr;
}
/** _attr **/
JSmarty.prototype._attr = function(src)
{
	var attr = [src,'',''];
	var ipp = src.indexOf(' '), imp = src.indexOf('|');

	if(imp >= 0)
	{
		attr[0] = src.slice(0,imp);
		attr[2] = src.slice(imp+1);
	}
	if(ipp >= 0)
	{
		attr[0] = src.slice(0,ipp);
		attr[1] = this._param(src.slice(ipp+1));
	}

	return attr;
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
JSmarty.prototype._modifier = function()
{
	var modifier;
}
/** _plugin **/
JSmarty.prototype._plugin = function(attr, src, type)
{
	var plugin = this._plugins[type];

	if(plugin[attr[0]] == void(0))
		plugin[attr[0]] = JSAN.require('JSmarty.'+ type +'.'+ attr[0]);
	if(!plugin[attr[0]]) return '';

	switch(type)
	{
		case 'Prefilter':
		case 'Postfilter':
		case 'Outputfilter':
			return plugin[attr[0]](src, this);
		case 'Function':
			return plugin[attr[0]](attr[1], this);
		case 'Block':
			return plugin[attr[0]](attr[1], src, this);
		case 'Modifier':
			return plugin[attr[0]].apply(null, attr[2]);
	}
}
/** parser **/
JSmarty.prototype.parser = function(src)
{
	var res, rex, isp, iep, ibp = 0, txt = '', attr;
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
			switch(this._attr(res)[0])
			{
				case 'else':
					break;
				case 'elsif':
					break;
				case attr[0]:
					count++;
					break;
				case '/'+attr[0]:
					flag = false;
					txt += this._plugin(attr, src.slice(ibp, isp), 'Block');
					break;
			}
			continue;
		}

		attr = this._attr(res);
		txt += src.slice(i, isp);

		switch(res.charAt(0))
		{
			case '*':
				break;
			case '#':
				break;
			case '$':
				txt += this._var(attr);
				break;
			default:
				if(blocks[attr[0]])
					flag = true, ibp = iep + R.length;
				else
					txt += this._plugin(attr, null, 'Function');
				break;
		}
	}

	return (rex) ? this._filter(txt + src.slice(i), 'post') : txt + src.slice(i);
}
/* --------------------------------------------------------------------
 # Template Variables
 -------------------------------------------------------------------- */
/** assign **/
JSmarty.prototype.assign = function(tpl_var, value)
{
	switch(typeof value)
	{
		case 'undefined':
			value = null;
			break;
	}

	if(typeof tpl_var == 'string')
	{
		this._tpl_vars['$'+tpl_var] = value;
		return;
	}

	for(var i in tpl_var)
	{
		if(i == '') continue;
		this._tpl_vars[i] = tpl_var[i];
	}
}
/** clear_assign **/
JSmarty.prototype.clear_assign = function(tpl_var)
{
	if(typeof tpl_var == 'string')
	{
		delete this._tpl_vars[tpl_var];
		return;
	}

	for(var i in tpl_var)
	{
		if(i == '') continue;
		delete this._tpl_vars[tpl_var[i]];
	}
}
/** clear_all_assign **/
JSmarty.prototype.clear_all_assign = function(){
	this._tpl_vars = {};
}
/** get_template_vars **/
JSmarty.prototype.get_template_vars = function(tpl_var){
	return (tpl_var) ? this._tpl_vars[tpl_var] : this._tpl_vars;
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