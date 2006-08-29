/**
 * JSmarty plugin
 * @package JSmarty
 * @subpackage plugins
 */

/**
 * JSmarty {html_radios} function plugin
 *
 * Type:     function<br />
 * Name:     html_radios<br />
 * Original: Smarty {counter} function plugin
 *
 * @author   shogo < shogo4405 at gmail dot com>
 * @version  1.0.0
 * @see      http://smarty.php.net/manual/en/language.function.html.radios.php
 * @param    object
 * @param    JSmarty
 * @return   string
 */
function jsmarty_function_html_radios(params, jsmarty)
{
	var k, i = 0, html = [];
	var outputf = jsmarty_function_html_radios.outputf;

	var name      = 'radio';
	var extra     = [];
	var labels    = true;
	var values    = null;
	var output    = null;
	var options   = null;
	var selected  = null;
	var separator = '';
	var label_ids = false;

	for(k in params)
	{
		if(!params.hasOwnProperty(k)) break;

		switch(k)
		{
			case 'name':
				name = params[k]; break;
			case 'separator':
				separator = params[k]; break;
			case 'checked':
			case 'selected':
				if(params[k] instanceof Array)
					jsmarty.trigger_error('html_radios: the "'+ k +'" attribute cannot be an array');
				else
					selected = params[k];
				break;
			case 'labels':
				labels = params[k]; break;
			case 'label_ids':
				label_ids = params[k]; break;
			case 'options':
				options = params[k]; break;
			case 'radios':
				jsmarty.trigger_error('html_radios: the use of the "radios" attribute is deprecated, use "options" instead');
				options = params[k];
				break;
			case 'assign':
				break;
			default:
				if(params[k] instanceof String)
					extra.push(k +'="'+ params[k] +'"');
				else
					jsmarty.trigger_error('html_radios: extra attribute "'+ i +'" cannot be an array');

				break;
		};
	};

	if(!options && !values) return '';

	if(options)
	{
		for(k in options)
		{
			if(!options.hasOwnProperty(k)) break;
			html[i++] = outputf(name, k, options[k], selected, extra, separator, labels, label_ids);
		}
	}
	else
	{
		for(k in values)
		{
			if(!values.hasOwnProperty(k)) break;
			value = (output[k]) ? output[k] : '';
			html[i++] = outputf(name, k, value, selected, extra, separator, labels, label_ids);
		}
	}

	if(params.assign)
		jsmarty.assign(params.assign, html);
	else
		return html.join('\n');
};

jsmarty_function_html_radios.outputf = function(name, value, output, selected, extra, separator, labels, label_ids)
{
	var id, html = '';

	if(labels)
	{
		if(label_ids)
		{
			id = ''; // temp
			html += '<label for="'+ id +'">';
		}
		else
		{
			html += '<label>';
		}
	}

	html +=
		'<input type="radio" name="'+ name + '" value="'+ value + '"';

	if(labels && label_ids)
		html += ' id="'+ id +'"';

	if(value == selected)
		html += ' checked="checked"';

	html += extra.join('') + ' />' + output;
	if (labels) html += '</label>';
	html += separator;

	return html;
};