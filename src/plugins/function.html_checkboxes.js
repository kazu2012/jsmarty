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
 * @version  1.0.4
 * @see      http://smarty.php.net/manual/en/language.function.html.checkboxes.php
 * @param    {Object} params
 * @param    {JSmarty} jsmarty
 * @return   {String}
 */
function jsmarty_function_html_checkboxes(params, jsmarty)
{
	var Plugin = JSmarty.Plugin;

	var array_map = Plugin.getFunction('php.array_map');
	var array_values = Plugin.getFunction('php.array_values');

	var k, v, html = new JSmarty.Buffer();
	var outputf = jsmarty_function_html_checkboxes_outputf;

	Plugin.addPlugin('shared.escape_special_chars', jsmarty.plugins_dir);

	var name = 'checkbox';
	var extra = [];
	var labels = true;
	var output = null;
	var values = null;
	var options = null;
	var selected = null;
	var separator = '';

	for(k in params)
	{
		v = params[k];

		switch(k)
		{
			case 'assign': break;
			case 'name': name = v; break;
			case 'values': values = v; break;
			case 'labels': labels = v; break; 
			case 'output': output = v; break;
			case 'options': options = v; break;

			case 'checked':
			case 'selected':
				selected = array_map(
					function(v){ return v.toString(); }, array_values([v])
				);
				break;
			case 'checkboxes':
				options = v;
				jsmarty.trigger_error('html_checkboxes: the use of the "checkboxes" attribute is deprecated, use "options" instead');
				break;

			default:
				if(typeof(v) != 'object'){ extra.push(k +'="'+ v +'"'); break; };
				jsmarty.trigger_error('html_checkboxes: extra attribute '+ k +' cannot be an array');
				break;
		};
	};

	if(options)
	{
		for(k in options)
		{
			if(!options.hasOwnProperty(k)){ break; };
			html.append(outputf(name, k, options[k], selected, extra, separator, labels));
		}
	}
	else if(values)
	{
		for(k in values)
		{
			if(!values.hasOwnProperty(k)){ break; };
			html.append(outputf(name, k, (output[k]) ? output[k] : '', selected, extra, separator, labels));
		}
	};

	if(params.assign){
		jsmarty.assign(params.assign, html.toString('\n'));
	}else{
		return html.toString('\n');
	};
};

function jsmarty_function_html_checkboxes_outputf(name, value, output, selected, extra, separator, labels)
{
	var Plugin = JSmarty.Plugin;

	var in_array = Plugin.getFunction('php.in_array');
	var escape_special_chars = Plugin.getFunction('shared.escape_special_chars');

	var html = new JSmarty.Buffer((labels) ? '<label>' : '');

	html.append
	(
		'<input type="checkbox" name="',
		escape_special_chars(name), '[]" value="',
		escape_special_chars(value), '"'
	);

	if(in_array(value, selected)){
		html.append(' checked="checked"');
	};

	html.append(extra.join(' '), ' />', output);
	if(labels){ html.append('</label>'); };
	html.append(separator);

	return html.toString('');
};