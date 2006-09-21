/**
 * JSmarty plugin
 * @package JSmarty
 * @subpackage plugins
 */

/**
 * JSmarty indent modifier plugin
 *
 * Type:     modifier<br />
 * Name:     replace<br />
 *
 * @author   shogo < shogo4405 at gmail dot com>
 * @version  1.0.0RC1
 * @see      http://smarty.php.net/manual/en/language.modifier.replace.php
 * @param    {String} string
 * @return   {String} string with replaced
 */
function jsmarty_modifier_replace(string, search, replace)
{
	var index = 0;
	while((index = string.indexOf(search, index)) != -1)
		string = string.replace(search);
	return string;
};