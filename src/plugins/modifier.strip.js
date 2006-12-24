/**
 * JSmarty plugin
 * @package JSmarty
 * @subpackage plugins
 */

/**
 * JSmarty strip modifier plugin
 *
 * Type:     modifier<br />
 * Name:     strip<br />
 * Original: Smarty strip modifier plugin
 *
 * @author   shogo < shogo4405 at gmail dot com>
 * @version  1.0.0
 * @see      http://smarty.php.net/manual/en/language.modifier.strip.php
 * @param    {String} string
 * @param    {String} replace
 * @return   {String} string with spaces removed
 */
function jsmarty_modifier_strip(string, replace)
{
	if(replace == void(0)) replace = ' ';
	return string.replace(/ +/g, replace);
};