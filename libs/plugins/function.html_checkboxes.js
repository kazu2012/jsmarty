function jsmarty_function_html_checkboxes(params, jsmarty)
{
	var value, html = [];
	var outputf = jsmarty_function_html_checkboxes.output;

	var name      = 'checkbox';
	var extra     = [];
	var labels    = true;
	var output    = null;
	var values    = null;
	var selected  = null;
	var separator = '';

	for(var i in params)
	{
		switch(i)
		{
			case 'name':
				name = params[i]; break;
			case 'labels':// Boolean
				labels = params[i]; break; 
			case 'options':// Hash
				options = params[i]; break;
			case 'values':
				values = params[i]; break;
			case 'output':
				output = params[i]; break;
			case 'checked':
			case 'selected':
				if(!(params[i] instanceof Array))
					selected = [params[i]];
				break;
			case 'checkboxes':
				jsmarty.trigger_error('html_checkboxes: the use of the "checkboxes" attribute is deprecated, use "options" instead');
				options = params[i]; break;
			case 'assign':
				break;
			default:
				if(params[i] instanceof Object)
					jsmarty.trigger_error('html_checkboxes: extra attribute '+ i +' cannot be an array');
				else
					extra.push(i +'="'+ params[i] +'"');
				break;
		};
	};

	if(!options && !values) return '';

	if(options)
	{
		for(var key in options)
			html.push(outputf(name, key, options[key], selected, extra, separator, labels));
	}
	else
	{
		for(var i=0,fin=values.length;i<fin;i++)
		{
			value = (output[i]) ? output[i] : '';
			html.push(outputf(name, i, value, selected, extra, separator, labels));
		}
	}

	if(params.assign)
		jsmarty.assign(params.assign, html);
	else
		return html.join('\n');
};

jsmarty_function_html_checkboxes.output = function(name, value, output, selected, extra, separator, labels)
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