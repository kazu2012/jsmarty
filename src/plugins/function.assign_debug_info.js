/**
 * JSmarty plugin
 * @package JSmarty
 * @subpackage plugins
 */

/**
 * JSmarty {assign_debug_info} function plugin
 *
 * Type:     function<br />
 * Name:     assign_debug_info<br />
 * Original: Smarty {assign_debug_info} function plugin
 *
 * @author   shogo < shogo4405 at gmail dot com>
 * @version  0.0.0
 * @param    {Object} params
 * @param    {JSmarty} jsmarty
 * @return   {String}
 */
function jsmarty_function_assign_debug_info(params, jsmarty)
{
	var array_keys = JSmarty.Plugin.getFunction('array_keys');
	var array_values = JSmarty.Plugin.getFunction('array_values');
};