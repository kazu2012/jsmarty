/**
 * JSmarty plugin
 * @package JSmarty
 * @subpackage plugins
 */

/**
 * JSmarty {include} function plugin
 *
 * Type:     function<br />
 * Name:     include<br />
 *
 * @author   shogo < shogo4405 at gmail dot com>
 * @version  0.0.0
 * @see      http://smarty.php.net/manual/en/language.function.html.radios.php
 * @param    {Object} params
 * @param    {JSmarty} jsmarty
 * @return   {String}
 */
function jsmarty_function_include(params, jsmarty)
{
	if(params.file)
	{
		jsmarty.trigger_errot('include : ');
		return '';
	};
	var vars, html;
	return html;
};