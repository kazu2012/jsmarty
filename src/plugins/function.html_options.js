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
 * @version  1.0.0
 * @see      http://smarty.php.net/manual/en/language.function.html.options.php
 * @param    object
 * @param    JSmarty
 * @return   string
 */
function jsmarty_function_html_options(params, jsmarty)
{
	var k, value, i = 0, html = [];
	var optoutput = jsmarty_function_html_options.optoutput;

	var name = null;
	var extra = [];
	var output = null;
	var values = null;
	var options = null;
	var selected = [];

	for(k in params)
	{
		if(!params.hasOwnProperty(k)) break;
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
				break;
			default:
				if(typeof(params[k]) != 'object')
					extra.push(k +'="'+ params[k] +'"');
				else
					jsmarty.trigger_error('html_checkboxes: extra attribute '+ k +' cannot be an array');
				break;
		};
	};

	if(!options && !values) return '';

	if(options)
	{
		for(k in options)
		{
			if(!options.hasOwnProperty(k)) break;
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

	if(name == '')
		return html.join('\n');

	return '<select name="'+ name +'"'+ extra.join(' ') +'>\n'+ html.join('\n') +'</select>\n';
};

jsmarty_function_html_options.optoutput = function(key, value, selected)
{
	var k, html, i = 0;
	var optgroup = jsmarty_function_html_options.optgroup;

	if(typeof(value) == 'string')
	{
		html = 
			'<option label="'+ value + '" value="'+ key +'"';
		html += '>' + value + '</option>\n';
	}
	else
	{
		html = optgroup(key, value, selected);
	};

	return html;
};

jsmarty_function_html_options.optgroup = function(key, value, selected)
{
	var k, i = 0, html = [];
	var optoutput = jsmarty_function_html_options.optoutput;

	html[i++] = '<optgroup label="' + key + '">';
	for(k in value)
	{
		if(!value.hasOwnProperty(k)) break;
		html[i++] = optoutput(key, value, selected);
	};
	html[i++] = '</optgroup>\n';

	return html.join('\n');
};