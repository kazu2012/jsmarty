/**
 * JSmarty plugin
 * @package JSmarty
 * @subpackage plugins
 */

function jsmarty_function_html_select_time(params, jsmarty)
{
	var i = 0, html = [];

	time = new Date();

	if(display_hors)
	{
		hours = use_24_hours ? range(0, 23) : range(1, 12);
		hour_fm = use_24_houts ? '%H' : '%I';
		for(i = 0, for_max = hours.length; i < for_max; i++)
		{
			
		};
	};

	return html;
};