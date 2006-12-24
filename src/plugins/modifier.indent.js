/**
 * JSmarty plugin
 * @package JSmarty
 * @subpackage plugins
 */

/**
 * JSmarty indent modifier plugin
 *
 * Type:     modifier<br />
 * Name:     indent<br />
 *
 * @author   shogo < shogo4405 at gmail dot com>
 * @version  1.0.0
 * @see      http://smarty.php.net/manual/en/language.modifier.indent.php
 * @param    {String} string
 * @param    {String} charn
 * @param    {String} chars
 * @return   {String} indented string
 */
function jsmarty_modifier_indent(string, charn, chars)
{
	if(chars == void(0)) chars = ' ';
	if(charn == void(0)) charn = 4;
	return Array(charn + 1).join(chars) + string;
};