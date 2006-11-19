/**
 * JSmarty plugin
 * @package JSmarty
 * @subpackage plugins
 */

/**
 * JSmarty {html_options} function plugin
 *
 * Type:     function<br />
 * Name:     html_options<br />
 * Original: Smarty {html_options} function plugin
 *
 * @author   shogo < shogo4405 at gmail dot com>
 * @version  1.0.3
 * @see      http://smarty.php.net/manual/en/language.function.html.options.php
 * @param    {Object} params
 * @param    {JSmarty} jsmarty
 * @return   {String}
 */

function jsmarty_function_html_options(params, jsmarty)
{
	var Plugin = JSmarty.Plugin;

	var k, value, i = 0, html = [];
	var optoutput = jsmarty_function_html_options_optoutput;
	var strval = Plugin.getFunction('php.strval');
	var array_map = Plugin.getFunction('php.array_map');
	var array_values = Plugin.getFunction('php.array_values');

	Plugin.addPlugin('shared.escape_special_chars', jsmarty.plugins_dir);

	var name = null;
	var extra = [];
	var output = null;
	var values = null;
	var options = null;
	var selected = [];

	for(k in params)
	{
		if(!params.hasOwnProperty(k)) continue;

		switch(k)
		{
			case 'name':
				name = params[k]; break;
			case 'options':
				options = params[k]; break;
			case 'values':
				values = params[k]; break;
			case 'output':
				output = params[k]; break;
			case 'selected':
				selected = array_map(strval, array_values([params[k]]));
				break;
			default:
				if(typeof(params[k]) != 'object')
					extra[i++] = ' ' + k +'="'+ params[k] +'"';
				else
					jsmarty.trigger_error('html_checkboxes: extra attribute '+ k +' cannot be an array');
				break;
		};
	};

	if(!options && !values) return;

	if(options)
	{
		for(k in options)
		{
			if(!options.hasOwnProperty(k)) continue;
			html[i++] = optoutput(k, options[k], selected)
		};
	}
	else
	{
		for(k in values)
		{
			value = (output[k]) ? output[k] : '';
			html[i++] = optoutput(k, value, selected)
		};
	};

	return (name) ? '<select name="'+ name +'"'+ extra.join('') +'>\n'+ html.join('\n') +'</select>\n' : html.join('\n');
};

function jsmarty_function_html_options_optoutput(key, value, selected)
{
	var optgroup = jsmarty_function_html_options_optgroup;
	var i = 0, html = [], Plugin = JSmarty.Plugin;
	var escape_special_chars = Plugin.getFunction('shared.escape_special_chars');
	var is_array = Plugin.getFunction('php.is_array'), in_array = Plugin.getFunction('php.in_array');

	if(!is_array(value))
	{
		value = escape_special_chars(value);
		html[i++] = '<option label="' + value + '" value="' + escape_special_chars(key) +'"';
		if(in_array(key, selected)) html[i++] = ' selected="selected"';
		html[i++] = '>' + value + '</option>';
	};

	return (0 < i) ? html.join('') : optgroup(key, value, selected);
};

function jsmarty_function_html_options_optgroup(key, value, selected)
{
	var k, i = 0, html = [];
	var optoutput = jsmarty_function_html_options_optoutput;

	html[i++] = '<optgroup label="' + key + '">';
	for(k in value)
	{
		if(!value.hasOwnProperty(k)) continue;
		html[i++] = optoutput(key, value, selected);
	};
	html[i++] = '</optgroup>';

	return html.join('');
};