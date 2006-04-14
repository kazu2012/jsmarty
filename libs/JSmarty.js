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
	_pattern: new RegExp(),
	_tpl_vars:{},
	_jsmarty_vars:{ get:{}, template:'', foreach:{}, sections:{}, version: JSmarty.VERSION },
	_plugin:
	{
		Block		: { Foreach:true, Section:true, Capture: true, 'If':true, Testformat:true },
		Insert		: {},
		Modifier	: {},
		Compiler	: { Assign:true },
		Resource	: {},
		Function	: { Cycle :true, Ldelim:true, Rdelim:true, Html_image:true },
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
			array = this._jsmarty_vars;
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
			if(block.flag)
			{
				block.content += content[i];
				content[i] = '';
			}
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
				JSAN.use('JSmarty.Block.'+result[1]);
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
// assign
JSmarty.prototype.assign = function(tpl_var, value)
{
	if(typeof value == 'undefined') value = null;

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
		this._tpl_vars['$'+tpl_var] = value;
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

	complete = function(request)
	{
		if(jsmarty.debugging) var e, s = (new Date()).getTime();
		jsmarty._result   = jsmarty.parser(request.responseText);
		if(jsmarty.debugging)
		{
			e =(new Date()).getTime();
			alert('HTML Convert Time:\t'+ (e-s)/1000 +' Sec');
		}
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
JSmarty.prototype.register_block = function(block){
	this._plugin.Block[block] = true;
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