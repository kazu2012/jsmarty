/**
 * JSmarty plugin
 * @package JSmarty
 * @subpackage plugins
 */

function jsmarty_modifier_date_format(string, format, default_date)
{
	var strftime = JSmarty.Plugin.get('php.strftime');

	if(format == void(0)) format = '%b %e %Y';
	if(default_date == void(0)) default_date = null;

	if(string != '')
		return strftime(format, new Date(string).getTime());
	if(!default_date)
		return strftime(format, new Date(string).getTime());

	return '';
};