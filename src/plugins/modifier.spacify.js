/**
 * JSmarty plugin
 * @package JSmarty
 * @subpackage plugins
 */

/**
 * JSmarty spacify modifier plugin
 *
 * Type:     modifier<br />
 * Name:     spacify<br />
 *
 * @author   shogo < shogo4405 at gmail dot com>
 * @version  1.0.0
 * @see      http://smarty.php.net/manual/en/language.modifier.spacify.php
 * @param    {String} string
 * @return   {String} string with spaced (eg. a b c d)
 */
function jsmarty_modifier_spacify(string, spacify_char)
{
	if(spacify_char == void(0)) spacify_char = ' ';
	return string.split(/.{0}/).join(spacify_char);
};