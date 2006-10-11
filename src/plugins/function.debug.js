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
	var Plugin = JSmarty.Plugin;

	Plugin.addPlugin('core.display_debug_console', JSmarty.getSelfPath() + '/internal');

	if(params.output != void(0))
		jsamrty.assign('_jsmarty_debug_output', params.output);

	return Plugin.getFunction('core.display_debug_console');
};