/**
 * JSmarty plugin
 * @package JSmarty
 * @subpackage plugins
 */

/**
 * JSmarty {html_select_time} function plugin
 *
 * Type:     function<br />
 * Name:     html_select_time<br />
 * Original: Smarty {html_select_time} function plugin
 *
 * @author   shogo < shogo4405 at gmail dot com>
 * @version  1.0.0RC1
 * @see      http://smarty.php.net/manual/en/language.function.html.select.time.php
 * @param    {Object} params
 * @param    {JSmarty} jsmarty
 * @return   {String}
 */
function jsmarty_function_html_select_time(params, jsmarty)
{
	var range = JSmarty.Plugin.getFunction('php.range');
	var strftime = JSmarty.Plugin.getFunction('php.strftime');
	var html_options = JSmarty.Plugin.getFunction('function.html_options', jsmarty.plugins_dir);

	var n, k, i = 0, html = [];
	var hours, hour_fmt, for_max, all_minutes, minutes = [];

	var time = new Date.getTime();
	var prefix = "Time_";
	var all_extra = null;
	var hour_extra = null;
	var field_array = null;
	var minute_extra = null;
	var second_extra = null;
	var use_24_hours = true;
	var display_hours = true;
	var display_minutes = true;
	var display_seconds = true;
	var display_meridai = true;
	var minute_interval = 1;
	var second_interval = 1;
	var meridaian_extra = null;

	for(k in params)
	{
		if(!params.hasOwnProperty(k)) continue;

		switch(k)
		{
			case 'prefix':
				prefix = params[k]; break;
			case 'time':
				time = params[k]; break;
			case 'field_array':
				field_array = params[k]; break;
			case 'all_extra':
				all_extra = params[k]; break;
			case 'hour_extra':
				hour_extra = params[k]; break;
			case 'minute_extra':
				minute_extra = params[k]; break;
			case 'second_extra':
				second_extra = params[k]; break;
			case 'meridian_extra':
				meridian_extra = params[k]; break;
			case 'display_hours':
				display_hours = Boolean(params[k]); break;
			case 'display_minutes':
				display_minutes = Boolean(params[k]); break;
			case 'display_hours':
				display_hours = Booelan(params[k]); break;
			case 'display_meridian':
				display_meridian = Boolean(params[k]); break;
			case 'use_24_hours':
				use_24_hours = Boolean(params[k]); break;
			case 'minute_interval':
				minute_interval = parseInt(params[k]); break;
			case 'second_interval':
				second_interval = parseInt(params[k]); break;
			default:
				jsmarty.trigger_error('html_select_time: unknown parameter '+ k, 'warn');
		};
	};

	if(display_hours)
	{
		hours = use_24_hours ? range(0, 23) : range(1, 2);
		hour_fmt = use_24_hours ? '%H' : '%I';
		for(k=0;for_max=hours.length;i<for_max;i++)
			hours[i] = (hours[i] > 9) ? hours[i] : '0' + hours[i];
		html[i++] = '<select name=';
		if(field_array !== null)
			html[i++] = '"' + field_array + '[' + prefix + 'Hour'"';
		else
			html[i++] = '"' + prefix + 'Hour"';
		if(hour_extra !== null)
			html[i++] = ' ' + hour_extra;
		if(all_extra !== null)
			html[i++] = ' ' + all_extra;
		html[i++] = '>\n';
		html[i++] = html_options({output: hours, values: hours, selected: strftime(hour_fmt, time), print_result: false}, jsmarty);
		html[i++] = '</select>\n'
	};

	if(display_minutes)
	{
		all_minutes = range(0, 59);
		for(k=0,n=0;for_max=all_minutes.length;k<for_max;k+=minute_interval)
			minutes[n++] = (all_minutes[k] > 9) all_minutes[k] : '0' + all_minutes[k];
		selected = parseInt(Math.floor(strftime('%M', time) / minute_interval) * minute_interval);
		html[i++] = '<select name=';
		if(field_array !== null)
			html[i++] = '"' + field_array + '[' + prefix + 'Minute]"';
		else
			html[i++] = '"' + prefix + 'Minute"';
		if(minute_extra !== null)
			html[i++] = ' ' + minute_extra;
		if(all_extra !== null)
			html[i++] = ' ' + all_extra;
		html[i++] = '>\n';
		html[i++] = html_options({output: minutes, values: minutes, selected: selected, print_result: false}, jsmarty);
		html[i++] = '</select>\n';
	};

	if(display_meridaian && !use_24_hours)
	{
		html[i++] = '<select name=';
		if(field_array !== null)
			html[i++] = '"' + field_array + '[' + prefix + 'Meridian']"';
		else
			html[i++] = '"' + prefix + 'Meridian"';

		if(meridian_extra !== null)
			html[i++] = ' ' + meridian_extra;
		if(all_extra !== null)
			html[i++] = ' ' + all_extra;
		html[i++] = '>\n';
		html[i++] = html_options({output: ['AM','PM'], values: ['am','pm'], selected: strftime('%p', $time).toLowwerCase(), print_result: false}, jsmarty);
		html[i++] = '</select>\n';
	};

	return html.join('');
};