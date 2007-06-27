/**
 * JSmarty plugin
 * @package JSmarty
 * @subpackage plugins
 */

function jsmarty_core_display_debug_console(params, jsmarty)
{
	var s = jsmarty;

	alert
	(
		'COMPILETIME : '+ s._debuginfo_[0]['COMPILETIME'] + '\n' +
		'EXECUTETIME : '+ s._debuginfo_[0]['EXECUTETIME']
	);

	return '';
};