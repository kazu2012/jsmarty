/**
 * JSmarty plugin
 * @package JSmarty
 * @subpackage plugins
 */

/**
 * JSmarty {html_checkboxes} function plugin
 *
 * Type:     function<br />
 * Name:     html_checkboxes<br />
 * Original: Smarty {html_checkboxes} function plugin
 *
 * @author   shogo < shogo4405 at gmail dot com>
 * @version  1.0.3
 * @see      http://smarty.php.net/manual/en/language.function.html.checkboxes.php
 * @param    {Object} params
 * @param    {JSmarty} jsmarty
 * @return   {String}
 */
function jsmarty_function_html_checkboxes(params, jsmarty)
{
	JSmarty.Plugin.addPlugin('shared.escape_special_chars', jsmarty.plugins_dir);

	var k, value, i = 0, html = [];
	var outputf = jsmarty_function_html_checkboxes_outputf;
	var array_map = JSmarty.Plugin.getFunction('php.array_map');
	var array_values = JSmarty.Plugin.getFunction('php.array_values');

	var name = 'checkbox';
	var extra = [];
	var labels = true;
	var output = null;
	var values = null;
	var selected = null;
	var separator = '';

	for(k in params)
	{
		if(!params.hasOwnProperty(k)) continue;

		switch(k)
		{
			case 'name':
				name = params[k]; break;
			case 'labels':
				labels = params[k]; break; 
			case 'options':
				options = params[k]; break;
			case 'values':
				values = params[k]; break;
			case 'output':
				output = params[k]; break;
			case 'checked':
			case 'selected':
				selected = array_map
				(
					function(v){ return v.toString(); },
					array_values([params[k]])
				);
				break;
			case 'checkboxes':
				jsmarty.trigger_error('html_checkboxes: the use of the "checkboxes" attribute is deprecated, use "options" instead');
				options = params[k]; break;
			case 'assign':
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
			html[i++] = outputf(name, k, options[k], selected, extra, separator, labels);
		}
	}
	else
	{
		for(k in values)
		{
			if(!values.hasOwnProperty(k)) break;
			value = (output[k]) ? output[k] : '';
			html[i++] = outputf(name, k, value, selected, extra, separator, labels);
		}
	}

	if(params.assign)
		jsmarty.assign(params.assign, html);
	else
		return html.join('\n');
};

function jsmarty_function_html_checkboxes_outputf(name, value, output, selected, extra, separator, labels)
{
	var i = 0, html = [];
	var in_array = JSmarty.Plugin.getFunction('php.in_array');
	var escape_special_chars = JSmarty.Plugin.getFunction('shared.escape_special_chars');

	if(labels) html[i++] = '<label>';
	html[i++] =
		'<input type="checkbox" name="' +
		escape_special_chars(name) + '[]" value="' +
		escape_special_chars(value) + '"';

	if(in_array(value, selected))
		html[i++] = ' checked="checked"';

	html[i++] = extra.join(' ') + ' />' + output;
	if(labels) html[i++] = '</label>';
	html[i++] = separator;

	return html.join('');
};