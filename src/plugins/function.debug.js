/**
 * JSmarty plugin
 * @package JSmarty
 * @subpackage plugins
 */

/**
 * JSmarty {debug} function plugin
 *
 * Type:     function<br />
 * Name:     debug<br />
 * Original: Smarty {debug} function plugin<br />
 *
 * @author   shogo <shogo4405 at gmail dot com>
 * @version  0.0.0
 * @see      http://smarty.php.net/manual/en/language.function.debug.php
 * @param    {Object} params
 * @param    {JSmarty} jsmarty
 * @return   {String}
 */

function jsmarty_function_debug(params, jsmarty)
{
	var console = JSmarty.Plugin.get('core.display_debug_console');
	if(params.output != void(0))
		jsamrty.assign('_jsmarty_debug_output', params.output);
};