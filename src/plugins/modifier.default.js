/**
 * JSmarty plugin
 * @package JSmarty
 * @subpackage plugins
 */

/**
 * JSmarty default modifier plugin
 *
 * Type:     modifier<br />
 * Name:     default<br />
 *
 * @author   shogo < shogo4405 at gmail dot com>
 * @version  1.0.0
 * @see      http://smarty.php.net/manual/en/language.modifier.default.php
 * @param    {String} string
 * @return   {String}
 */
function jsmarty_modifier_default(string, defaults)
{
	if(defaults == void(0)) defaults = '';
	if(string == void(0) || string == '')
		return defaults;
	else
		return string;
};