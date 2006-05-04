////////////////////////////////////////////////////////////////////////
JSmarty = function(){};
JSmarty.Core = {};
JSmarty.Block = {};
JSmarty.Insert = {};
JSmarty.Modifier = {};
JSmarty.Compiler = {};
JSmarty.Resource = {};
JSmarty.Function = {};
JSmarty.Prefilter = {};
JSmarty.Postfilter = {};
JSmarty.Outputfilter = {};
/////////////////////////////////////////////////////////**NAME SPACES**
JSAN.use('JSmarty.Core.Ajax');
////////////////////////////////////////////////////////////**INCLUDES**
JSmarty.AUTHOR	= 'shogo';
JSmarty.VERSION = 'dev0.0.1';
JSmarty.LICENSE = 'LGPL';

JSmarty.prototype =
{
	$smarty:{ get:{},foreach:{},sections:{},capture:{},template:'',version: JSmarty.VERSION},

	debugging : false,
	template_dir : './templates',
	left_delimiter : '{',
	right_delimiter : '}',

	_ajax: new JSmarty.Core.Ajax(),
	_result:'',
	_pattern: new RegExp(),
	_tpl_vars:{},
	_plugin:
	{
		Block		: { Capture: true, Foreach:true, Section:true, 'If':true},
		Insert		: {},
		Modifier	: {},
		Compiler	: { Assign:true },
		Resource	: {},
		Function	: { Cycle :true, Counter:true, Ldelim:true, Rdelim:true},
		Postfilter	: {},
		Prefilter	: {},
		Outputfilter: {}
	}
}
/* --------------------------------------------------------------------
 # public methods : Parser
 -------------------------------------------------------------------- */
// toParams
JSmarty.prototype.toParams = function(string)
{
	var result;
	var params	= new Array();
	var pattern = new RegExp();

	pattern.compile('(\\w+)=(\'|\"|)([^\\s]+|[^\\2]+?)\\2','g');
	while((result = pattern.exec(string)) != null){
		params[result[1]] = result[3];
	}

	return params;
}
JSmarty.prototype.variables = function(string, array, prefix)
{
	var result;
	var L = this.left_delimiter;
	var R = this.right_delimiter;
	var pattern = this._pattern;

	if(!array)	array  = this._tpl_vars;
	if(!prefix) prefix = '';

	switch(prefix)
	{
		case '$smarty\\.':
			array = this.$smarty;
			break;
	}

	prefix = prefix.replace(/^\$/,'\\$');
	pattern.compile(L+prefix+'([\\w\.$]+)'+R,'');
	while((result = pattern.exec(string)) != null)
	{
		if(result[1].split('.').length > 1)
		{
			string = this.variables
					(
						string,
						array[result[1].split('.')[0]],
						result[1].split('.')[0]+'\\.'
					);
			continue;
		}
		string = string.replace(result[0], array[result[1]]);
	}

	return string;
}

// parser
JSmarty.prototype.parser = function(content)
{
	var result, pattern = new RegExp();
	var L = this.left_delimiter, R = this.right_delimiter;
	var block = { name:'', index:0, flag:false, content:''};

	pattern.compile(L+'([\\w/]+)([^'+L+']*?)'+R, 'g');
	content = content.replace(pattern, L+'M'+R+L+'$1$2'+R+L+'M'+R);
	content = content.split(L+'M'+R);

	for(i in content)
	{
		if((result = pattern.exec(content[i])) == null)
		{
			if(block.flag) block.content += content[i], content[i] = '';
			continue;
		}

		if(content[i] == block.close)
		{
			if(block.index > 0)
			{
				block.index--;
				continue;
			}
			if(typeof JSmarty.Block[block.name] == 'undefined')
				JSAN.use('JSmarty.Block.'+block.name);
			content[i] = JSmarty.Block[block.name](block.param, block.content, this);
			continue;
		}

		result[1] = result[1].charAt(0).toUpperCase() + result[1].substring(1);

		// Block
		if(this._plugin.Block[result[1]])
		{
			content[i] = '';

			if(block.flag) block.index++;

			block.name = result[1]; block.flag = true;
			block.param= result[2]; block.close= L+'/'+block.name.toLowerCase()+R;

			if(result[1] != 'If') block.param = this.toParams(block.param);

			continue;
		}
		// Function
		if(this._plugin.Function[result[1]])
		{
			if(typeof JSmarty.Function[result[1]] == 'undefined')
				JSAN.use('JSmarty.Function.'+result[1]);
			content[i] = JSmarty.Function[result[1]](this.toParams(result[2]), this);
			continue;
		}
	}

	return this.variables(content.join(''));
}
/* --------------------------------------------------------------------
 # public methods : Template Variables
 -------------------------------------------------------------------- */
// append
JSmarty.prototype.append = function()
{
	
}
// assign
JSmarty.prototype.assign = function(tpl_var, value)
{
	if(typeof value == 'undefined') value = null;

	if(typeof tpl_var == 'string')
	{
		this._tpl_vars['$'+tpl_var] = value;
		return;
	}

	for(i in tpl_var)
	{
		if(i == '') continue;
		this._tpl_vars[i] = tpl_var[i];
	}
}
// clear_assign
JSmarty.prototype.clear_assign = function(tpl_var)
{
	if(typeof tpl_var == 'string')
	{
		delete this._tpl_vars['$'+tpl_var];
		return;
	}

	for(i in tpl_var)
	{
		if(i == '') continue;
		delete this._tpl_vars['$'+tpl_var[i]];
	}
}
// clear_all_assign
JSmarty.prototype.clear_all_assign = function(){
	this._tpl_vars = new Array();
}
// get_template_vars
JSmarty.prototype.get_template_vars = function(tpl_var){
	return (tpl_var) ? this._tpl_vars[tpl_var] : this._tpl_vars;
}
/* --------------------------------------------------------------------
 # public methods : Template Process
 -------------------------------------------------------------------- */
// fetch
JSmarty.prototype.fetch = function(file, element, display)
{
	var oncomplete;
	var ajax = this._ajax, smarty = this;

	element = element || false;
	display = display || false;

	this.$smarty.template = file;

	if(element)
	{
		oncomplete = function(request)
		{
			return function()
			{
				if(request.readyState != 4) return;
				element.innerHTML = smarty.parser(request.responseText);
				request = null;
			}
		}
		ajax.request(this.template_dir +'/'+ file,{ oncomplete : oncomplete });
		return;
	}

	ajax.request(this.template_dir +'/'+ file,{async:false});
	this._result = this.parser(ajax.getText());

	if(display)
		document.write(this._result);

	return this._result;
}
// display
JSmarty.prototype.display = function(file, element){
	this.fetch(file, element, true);
}
/* --------------------------------------------------------------------
 # public methods : Plugins
 -------------------------------------------------------------------- */
// register_*
J.Smarty.prototype.register_block = function(block){
	this._plugin.Block[block] = true;
}
JSmarty.prototype.register_function = function(func){
	this._plugin.Function[func] = true;
}
JSmarty.prototype.register_modifier = function(modifier){
	this._plugin.Modifier[modifier] = true;
}
JSmarty.prototype.register_compiler_function = function(compiler){
	this._plugin.Compiler[compiler] = true;
}
// unregister_*
JSmarty.prototype.unregister_block = function(block){
	delete this._plugin.Block[block];
}
JSmarty.prototype.unregister_function = function(func){
	delete this._plugin.Function[func];
}
JSmarty.prototype.unregister_modifier = function(modifier){
	delete this._plugin.Modifier[modifier];
}
JSmarty.prototype.unregister_compiler_function = function(compiler){
	delete this._plugin.Compiler[compiler];
}
