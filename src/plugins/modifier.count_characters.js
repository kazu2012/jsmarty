/**
 * JSmarty plugin
 * @package JSmarty
 * @subpackage plugins
 */

/**
 * JSmarty count_characters modifier plugin
 *
 * Type:     modifier<br />
 * Name:     count_sentences<br />
 *
 * @author   shogo < shogo4405 at gmail dot com>
 * @version  1.0.0
 * @see      http://smarty.php.net/manual/en/language.modifier.count.characters.php
 * @param    {String} string
 * @return   {Number}
 */
function jsmarty_modifier_count_characters(string, include_spaces)
{
	if(include_spaces == void(0)) include_spaces = false;
	if(include_spaces)
		return string.length;

	return string.match(/[^\s]/g).length;
};