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
 * @version  1.0.0RC1
 * @see      http://smarty.php.net/manual/en/language.modifier.indent.php
 * @param    {String} string
 * @return   {String} indented string
 */
function jsmarty_modifier_indent(string, charn, chars)
{
	if(chars == void(0)) chars = ' ';
	if(charn == void(0)) charn = 4;

	var i, repeat = [];
	for(i = 0; i<= chars; i++)
		repeat[i] = '';

	return string.replace(/^/m, repeat.join(charn));
};