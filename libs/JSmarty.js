////////////////////////////////////////////////////////////////////////
if(typeof HTTP == 'undefined')
	HTTP = {};
if(typeof HTTP.Ajax == 'undefined')
	JSAN.use('HTTP.Ajax');
////////////////////////////////////////////////////////////////////////
JSmarty = function(){};

JSmarty.AUTHOR	= 'shogo';
JSmarty.VERSION = 'dev0.0.1';
JSmarty.LICENSE = 'LGPL';

JSmarty.prototype =
{
	template_dir : './templates',
	left_delimiter : '{',
	right_delimiter : '}',

	debugging : false,

	_ajax: new HTTP.Ajax(),
	_result: '',
	_tpl_vars:{},
	_jsmarty_vars:{ get:{}, template:'', foreach:{}, sections:{}, version: JSmarty.VERSION },
	_plugin:
	{
		Block		: { Foreach:true, Section:true, Capture: true, 'If':true, Testformat:true },
		Insert		: {},
		Modifier	: {},
		Compiler	: { Assign:true },
		Resource	: {},
		Function	: { Cycle :true },
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
	var params	= new Array();
	var pattern = new RegExp();

	pattern.compile("((\\w+)=(\\$|'|\")([^\\s'\"]+))","");
	while(pattern.test(string))
	{
		params[RegExp.$2] = RegExp.$4;
		string = string.replace(RegExp.$1, '');
	}

	return params;
}
// toText
JSmarty.prototype.toText = function(string, array, prefix)
{
	if(!array)	array	= this._tpl_vars;
	if(!prefix)	prefix	= '';

	var L = this.left_delimiter;
	var R = this.right_delimiter;
	var pattern = new RegExp();

	pattern.compile(L+'\\$'+prefix+'([\\w\.]+)(|\|[\\w:\|\'\"\]+)'+R,'');

	while(pattern.test(string))
	{
		if(RegExp.$1.split('.').length > 1)
		{
			string = this.toText
					(
						string,
						array[RegExp.$1.split('.')[0]],
						RegExp.$1.split('.')[0]+'\\.'
					);
			continue;
		}

		if(RegExp.$2.split('|').length > 1)
		{
		}

		string = string.replace(pattern, array[RegExp.$1]);
	}

	return string;
}
// parser
JSmarty.prototype.parser = function(result)
{
	var expression;
	var match, func, params, content;
	var L = this.left_delimiter;
	var R = this.right_delimiter;
	var pattern = new RegExp();

	// Block Expression
	pattern.compile('('+L+'(\\S+)([^'+L+']*?)'+R+'([^^]*)'+L+'\\/(\\1)[^'+R+']*'+R+')','m');
	while(pattern.test(result))
	{
		match	= RegExp.$1;
		func	= RegExp.$2.charAt(0).toUpperCase()+RegExp.$2.substr(1,RegExp.$2.length);
		params	= RegExp.$3;
		content	= RegExp.$4;

		if(this._plugin.Block[func])
		{
			if(typeof JSmarty.Block[func] == 'undefined')
				JSAN.use('JSmarty.Block.'+func);
			result = result.replace(match, JSmarty.Block[func](params, content, this));
			continue;
		}
		result = result.replace(match, '');
	}

	// Function Expression
	pattern.compile('('+L+'(\\w+)([^'+L+']*?)'+R+')','m');
	while(pattern.test(result))
	{
		match	= RegExp.$1;
		func	= RegExp.$2.charAt(0).toUpperCase()+RegExp.$2.substr(1,RegExp.$2.length);
		params	= RegExp.$3;

		if(this._plugin.Function[func])
		{
			if(typeof JSmarty.Function[func] == 'undefined')
				JSAN.use('JSmarty.Function.'+func);
			result = result.replace(match, JSmarty.Function[func](params, this));
			continue;
		}
		result = result.replace(match, '');
	}

	return this.toText(result);
}
/* --------------------------------------------------------------------
 # public methods : Template Variables
 -------------------------------------------------------------------- */
// assign
JSmarty.prototype.assign = function(tpl_var, value)
{
	if(!value) value = null;

	if(typeof tpl_var == 'object')
	{
		for(key in tpl_var)
		{
			if(key != '')
				this._tpl_vars[key] = tpl_var[key];
		}
		return;
	}
	if(tpl_var != '')
		this._tpl_vars[tpl_var] = value;
}
// get_template_vars
JSmarty.prototype.get_template_vars = function(tpl_var)
{
	return this._tpl_vars[tpl_var];
}
/* --------------------------------------------------------------------
 # public methods : Template Process
 -------------------------------------------------------------------- */
// fetch
JSmarty.prototype.fetch = function()
{
	
}
// display
JSmarty.prototype.display = function(file, element)
{
	var complete, jsmarty = this;
	this._jsmarty_vars.templete = this.template_dir +'/'+ file;

	complete = function(request){
		jsmarty._result   = jsmarty.parser(request.responseText);
		element.innerHTML = jsmarty._result;
	}

	this._ajax.request
	(
		this._jsmarty_vars.templete,'',{
		onComplete : complete
	});
}
/* --------------------------------------------------------------------
 # public methods : Plugins
 -------------------------------------------------------------------- */
// register_*
JSmarty.prototype.register_block = function(){
	
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

////////////////////////////////////////////////////////////////////////
JSmarty.Block = {};
JSmarty.Modifier = {};
JSmarty.Function = {};
JSMarty.Prefilter = {};
JSmarty.Postfilter = {};
//////////////////////////////////////////////////////// *NAMESPACES* //