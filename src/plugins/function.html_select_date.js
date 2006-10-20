/**
 * JSmarty plugin
 * @package JSmarty
 * @subpackage plugins
 */

function jsmarty_function_html_select_date(params, jsmarty)
{
	var html_options =
		JSmarty.Plugin.getFunction('function.html_options', jsmarty.plugins_dir);
	var escape_special_chars =
		JSmarty.Plugin.getFunction('shared.escape_special_chars', jsmarty.plugins_dir);

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