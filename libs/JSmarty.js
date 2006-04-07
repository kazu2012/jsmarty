////////////////////////////////////////////////////////////////////////
if(typeof HTTP == 'undefined')
	HTTP = {};
if(typeof HTTP.Ajax == 'undefined')
	JSAN.use('HTTP.Ajax');
////////////////////////////////////////////////////////////////////////
JSmarty = function()
{
	this.template_dir	= './templates';
	this.left_delimiter	= '{';
	this.right_delimiter= '}';

	this._result = new String();

	this._tpl_vars =
	{
		smarty:
		{
			get		: {},
			cookies	: {},
			foreach	: {},
			section	: {},
			version	: JSmarty.VERSION,
			template: ''
		}
	};

	this._plugin =
	{
		Block		: { Foreach:true, Section:true, Capture: true, 'If':true },
		Insert		: {},
		Modifier	: {},
		Compiler	: { Assign:true },
		Resource	: {},
		Function	: {},
		Prefilter	: {},
		Postfilter	: {},
		Outputfilter: {}
	};

}
JSmarty.VERSION = 'dev0.0.1';
JSmarty.LICENSE = 'LGPL';
/* --------------------------------------------------------------------
 # public methods : Parser
 -------------------------------------------------------------------- */
// toParams
JSmarty.prototype.toParams = function(string)
{
	var params	= new Array();
	var pattern = new RegExp();

	pattern.compile("(\\w+)=(\\$|[']|\")([^\\s'\"]+)","");

	while(pattern.test(string))
	{
		params[RegExp.$1] = RegExp.$3;
		string = string.replace(pattern, '');
	}

	return params;
}
// toText
JSmarty.prototype.toText = function(string, array, prefix)
{
	array = (typeof array != 'undefined') ? array  : this._tpl_vars;
	prefix= (typeof prefix!= 'undefined') ? prefix : '' ;

	var L = this.left_delimiter;
	var R = this.right_delimiter;
	var pattern = new RegExp();

	pattern.compile(L+'\\$'+prefix+'([\\w\.]+)(|\\|[\\w\\:=\'\"]+)'+R,'');

	while(pattern.test(string))
	{
		if(RegExp.$1.split('.').length > 1)
		{
			string = this.toText(
						string,
						array[RegExp.$1.split('.')[0]],
						RegExp.$1.split('.')[0]+'\\.'
					);
			continue;
		}
		// 仮実装
		switch('')
		{
			default:
				string = string.replace(pattern, array[RegExp.$1]);
				break;
		}
	}

	return string;
}
// parser
JSmarty.prototype.parser = function(result)
{
	var func, params, content;
	var L = this.left_delimiter;
	var R = this.right_delimiter;
	var pattern = new RegExp();

	// Block Expression
	pattern.compile(L+'(\\S+)([^'+L+']*?)'+R+'([^^]*)'+L+'\\/(\\1)[^'+R+']*'+R,'m');
	while(pattern.test(result))
	{
		params = RegExp.$2, content = RegExp.$3;
		func = RegExp.$1.substr(0, 1).toUpperCase();
		func+= RegExp.$1.substr(1, RegExp.$1.length);

		if(this._plugin.Block[func])
		{
			if(typeof JSmarty.Block[func] == 'undefined')
				JSAN.use('JSmarty.Block.'+func);
			result = result.replace(pattern, JSmarty.Block[func](params, content, this));
			continue;
		}
		result = result.replace(pattern, '');
	}

	// Function Expression

	return result;
}
/* --------------------------------------------------------------------
 # public methods : Templates Variables
 -------------------------------------------------------------------- */
JSmarty.prototype.assign = function(tpl_var, value)
{
	value = (typeof value == 'undefined') ? '' : value;

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
// fetch
JSmarty.prototype.fetch = function(file)
{
	var request = new HTTP.Ajax().create();

	// ここら辺かなりの仮実装です(汗)
	request.open('GET',this.template_dir +'/'+ file);
	request.send('');
	this._result = this.parser(request.responseText);

	return this.toText(this._result,this._tpl_vars,'');
}
// display
JSmarty.prototype.display = function(file)
{
	document.write(this.fetch(file));
}

// get_template_vars
JSmarty.prototype.get_template_vars = function(tpl_var)
{
	return this._tpl_vars[tpl_var];
}
////////////////////////////////////////////////////////////////////////
JSmarty.Block = {};
JSmarty.Modifier = {};
JSmarty.Function = {};
JSMarty.Prefilter = {};
JSmarty.Postfilter = {};
//////////////////////////////////////////////////////// *NAMESPACES* //