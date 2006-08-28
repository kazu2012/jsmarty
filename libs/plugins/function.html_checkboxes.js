/**
 * JSmarty plugin
 * @package JSmarty
 * @subpackage plugins
 */

/**
 * JSmarty html_checkboxes function plugin
 *
 * Type:     function<br />
 * Name:     html_checkboxes<br />
 * Purpose:  <br />
 * Credit :  
 *
 * @author   shogo < shogo4405 at gmail dot com>
 * @version  1.01
 * @param    string
 * @return   string
 */
function jsmarty_function_html_checkboxes(params, jsmarty)
{
	var k, value, i = 0, html = [];
	var outputf = jsmarty_function_html_checkboxes.outputf;

	var name      = 'checkbox';
	var extra     = [];
	var labels    = true;
	var output    = null;
	var values    = null;
	var selected  = null;
	var separator = '';

	for(k in params)
	{
		if(!params.hasOwnProperty(k)) break;

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
				if(!(params[k] instanceof Array))
					selected = params[k];
				break;
			case 'checkboxes':
				jsmarty.trigger_error('html_checkboxes: the use of the "checkboxes" attribute is deprecated, use "options" instead');
				options = params[k]; break;
			case 'assign':
				break;
			default:
				if(params[k] instanceof String)
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

jsmarty_function_html_checkboxes.outputf = function(name, value, output, selected, extra, separator, labels)
{
	var html = '';

	if(labels) html += '<label>';
	html +=
		'<input type="checkbox" name="'+
		name + '[]" value="'+ value + '"';

	if(selected)
	{
		for(var i=selected.length-1;i>=0;i--)
		{
			if(value == selected[i])
				html += ' checked="checked"';
		}
	}

	html += extra.join(' ') + ' />' + output;
	if(labels) html += '</label>';
	html += separator;

	return html;
};