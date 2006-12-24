/**
 * JSmarty plugin
 * @package JSmarty
 * @subpackage plugins
 */

/**
 * JSmarty string_format modifier plugin
 *
 * Type:     modifier<br />
 * Name:     string_format<br />
 * Original: Smarty string_format modifier plugin
 *
 * @author   shogo < shogo4405 at gmail dot com>
 * @version  1.0.0
 * @see      http://smarty.php.net/manual/en/language.modifier.string.format.php
 * @param    {String} string
 * @param    {String} format
 * @return   {String}
 */
function jsmarty_modifier_string_format(string, format)
{
	// Wrapper for sprintf function
	return JSmarty.Plugin.getFunction('php.sprintf')(format, string);
};