/**
 * JSmarty plugin
 * @package JSmarty
 * @subpackage plugins
 */

function jsmarty_function_html_select_date(params, jsmarty)
{
	var dir = jsmarty.plugins_dir, P = JSmarty.Plugin;

	var date = P.getFunction('php.date');
	var strftime = P.getFunction('php.strftime');
	var html_options = P.getFunction('function.html_options', dir);
	var escape_special_chars = P.getFunction('shared.escape_special_chars', dir);

	var time = new Date();
	var prefix = 'Date_';
	var day_size = null;
	var end_year = '';
	var all_empty = null;
	var day_empty = null;
	var year_size = null;
	var all_extra = null;
	var day_extra = null;
	var start_year = '';
	var day_format = '%02d';
	var year_empty = null;
	var month_size = null;
	var year_extra = null;
	var field_array = null;
	var field_order = 'MDY';
	var month_extra = null;
	var extra_attrs = '';
	var month_empty = null;
	var display_days = true;
	var month_format = '%B';
	var year_as_text = false;
	var display_years = true;
	var reverse_years = false;
	var display_months = true;
	var field_separator = '\n';
	var day_value_format = '%d';
	var month_value_format = '%m';

	for(k in params)
	{
		if(!params.hasOwnProperty(k)) continue;

		switch(k)
		{
			case 'prefix':
				prefix = params[k]; break;
			case 'time':
				time = params[k]; break;
			case 'start_year':
				start_year = params[k]; break;
			case 'end_year':
				end_year = params[k]; break;
			case 'month_format':
				month_format = params[k]; break;
			case 'day_format':
				day_format = params[k]; break;
			case 'day_value_format':
				day_value_format = params[k]; break;
			case 'field_array':
				field_array = params[k]; break;
			case 'day_size':
				day_size = params[k]; break;
			case 'month_size':
				month_size = params[k]; break;
			case 'year_extra':
				year_extra = params[k]; break;
			case 'field_order':
				field_order = params[k]; break;
			case 'field_separator':
				field_separator = params[k]; break;
			case 'month_value_format':
				month_value_format = params[k]; break;
			case 'month_empty':
				month_empty = params[k]; break;
			case 'day_empty':
				day_empty = params[k]; break;
			case 'year_empty':
				year_empty = params[k]; break;
			case 'all_empty':
				all_empty = params[k];
				day_empty = month_empty = year_empty = all_empty;
				break;
			case 'display_days':
				display_days = params[k]; break;
			case 'display_months':
				display_months = params[k]; break;
			case 'display_years':
				display_years = params[k]; break;
			case 'year_as_text':
				year_as_text = params[k]; break;
			case 'reverse_years':
				reverse_years = params[k]; break;
			default:
				break;
		};
	};

	if(time.match(/^-\d+$/))
		time = date('Y-m-d', time);
	if(time.match(/^\d{0,4}-\d{0.2}-\d{0,2}$/))
		time = strftime('%Y-%m-%d', new Date(time).getTime());
	time = time.split('-', time);

	if(match = end_year.match(/^(\+|\-)\s*(\d+)$/))
	{
		if(match[1] == '+')
			end_year = strftime('%Y') + match[2];
		else
			end_year = strftime('%Y') - match[2];
	};

	if(match = start_year.match(/^(\+|\-)\s*(\d+)$/))
	{
		if(match[1] == '+')
			start_year = strftime('%Y') + match[2];
		else
			start_year = strftime('%Y') - match[2];
	};

	if(time[0].length > 0)
	{
		if(start_year > time[0] && !params.start_year)
			start_year = time[0];
		if(end_year < time[0] && !params.end_year)
			end_year = time[0];
	};

	field_order = field_order.toUpperCase();
	html_result = month_result = day_result = year_result = '';

	if(display_months)
	{
		month_names = [];
		month_values = [];

		if(month_empty)
		{
			month_names[''] = month_empty;
			month_values[''] = '';
		}
		for(i=1;i<=12;i++)
		{
			month_names[i] = strftime(month_format, new Date().getTime());
			month_values[i] = strftime(month_value_format, new Date().getTime());
		}

		month_result += '<select name=';
		if(null !== field_array)
			month_result += '"' + field_array + '[' + prefix + 'Month]"';
		else
			month_result += '"' + prefix + 'Month"';
		if(null !== month_size)
			month_result += ' size="' + month_size + '"';
		if(null !== month_extra)
			month_result += ' ' + month_extra;
		if(null !== all_extra)
			month_result += ' ' + all_extra;
		month_result += extra_attrs + '>\n';
		month_result += html_options
		({
			output : month_names,
			values : month_values,
			selexted : '',
			print_result : false
		}, jsmarty);
		month_result += '</select>';
	};

	if(display_years)
	{
		if(field_array !== null)
			year_name = field_array + '['+ prefix +']';
		else
			year_name = prefix + 'Year';

		if(years_as_text)
		{
			if(all_extra !== null)  year_result += ' ' + all_extra;
			if(year_extra !== null) year_result += ' ' + year_result;
			year_result += ' />';
		}
		else
		{
			
		};
	};

	return html_result.join(field_separator);
};