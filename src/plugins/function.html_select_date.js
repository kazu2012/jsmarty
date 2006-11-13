/**
 * JSmarty plugin
 * @package JSmarty
 * @subpackage plugins
 */

/**
 * JSmarty {html_select_date} function plugin
 *
 * Type:     function<br />
 * Name:     html_select_date<br />
 * Original: Smarty {html_select_date} function plugin
 *
 * @author   shogo < shogo4405 at gmail dot com>
 * @version  1.0.0RC1
 * @see      http://smarty.php.net/manual/en/language.function.html.select.date.php
 * @param    {Object} params
 * @param    {JSmarty} jsmarty
 * @return   {String}
 */
function jsmarty_function_html_select_date(params, jsmarty)
{
	var dir = jsmarty.plugins_dir, Plugin = JSmarty.Plugin;

	var range = Plugin.getFunction('php.range');
	var sprintf = Plugin.getFunction('php.sprintf');
	var strftime = Plugin.getFunction('php.strftime');
	var html_options = Plugin.getFunction('function.html_options', dir);
	var escape_special_chars = Plugin.getFunction('shared.escape_special_chars', dir);

	var days, month_names, month_values;
	var n, i = 0, k = 0, html = [], month = [], day = [], year = [];

	var time = new Date.getTime();
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

	if(display_months)
	{
		month_names = [];
		month_values = [];

		if(month_empty)
		{
			month_names = [0] = month_empty;
			month_values= [0] = '', n++;
		};
		for(k=0;k<=12;k++)
		{
			month_names[n+k] = strftime(month_format, new Date(2000, 1, k).getTime());
			month_values[n+k] = strftime(month_vale_format, new Date(2000, 1, k).getTime());
		};
		month[i++] = '<select name=';
		if(field_array !== null)
			month[i++] = '"' + field_array + '[' + prefix + 'Month]"';
		else
			month[i++] = '"' + prefix + 'Month"';
		if(month_size !== null)
			month[i++] = ' size="' + month_size + '"';
		if(month_extra !== null)
			month[i++] = ' ' + all_extra;
		month[i++] = extra_attrs + '>\n';
		month[i++] = html_options({
						output:month_names, values:month_values,
						selected: time[1] ? strftime(month_value_format, new Date(2000, 1, time[1]).getTime()) : ''
					}, jsmarty);
		month[i++] = '</select>';
	};

	if(display_days)
	{
		i = 0, n = 0, days = [];

		if(day_empty)
		{
			days[0] = day_empty;
			day_values[0] = '', n++;
		};
		for(k=1;k<=31;k++)
		{
			days[n+k] = sprintf(day_format, k);
			day_values[n+k] = sprintf(day_value_format, k);
		};

		day = '<select name=';
		if(field_array !== null)
			day[i++] = '"' + field_array + '[' + prefix + 'Day]"';
		else
			day[i++] = '"' + prefix + 'Day"';
		if(day_size !== null)
			day[i++] = ' size="'+ day_size + '"';
		if(all_extra !== null)
			day[i++] = ' ' + all_extra;
		if(day_extra !== null)
			day[i++] = ' ' + day_extra;
		day[i++] = extra_attrs + '>\n';
		day[i++] = html_options({ output:days, values:day_values, selected:time[1], print_result:false }, jsmarty);
		day[i++] = '</select>';
	};

	var years, year_name;

	if(display_years)
	{
		i = 0;

		if(field_array)
			year_name = field_array + '[' + prefix + 'Year]';
		else
			year_name = prefix + 'Year';

		if(year_as_text)
		{
			year[i++] =
				'<input type="text" name="' + year_name + '" value="' +
				time[0] + '" size="4" maxlength="4";
			if(all_extra !== null)
				year[i++] = ' ' + all_extra;
			if(year_extra !== null)
				year[i++] = ' ' + year_extra;
			year[i++] = ' />';
		}
		else
		{
			years = range(parseInt(start_year), parseInt(end_year));
			if(reverse_years)
				years.sort()
			else
				years.sort();
			year[i++] = '<select name="' + year_name + '"';
			if(year_size !== null)
				year[i++] = ' size="' + year_size + '"';
			if(all_extra !== null)
				year[i++] = ' ' + year_extra;
			year[i++] = extra_attrs + '>\n';
			year[i++] = html_options({ output:years, values:yearvals, selected:time[0], print_result:false }, jsmarty);
			year[i++] = '</select>';
		};
	};

	for(i=0;i<=2;i++)
	{
		c = field_order.charAt(i);
		switch(c)
		{
			case 'D':
				html[i] = day;
				break;
			case 'M':
				html[i] = month;
				break;
			case 'Y':
				html[i] = year;
				break;
		};
	};

	return html.join(field_separator);
};