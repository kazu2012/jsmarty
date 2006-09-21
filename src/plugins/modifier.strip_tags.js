/**
 * JSmarty plugin
 * @package JSmarty
 * @subpackage plugins
 */

/**
 * JSmarty strip_tags modifier plugin
 *
 * Type:     modifier<br />
 * Name:     strip_tags<br />
 * Original: Smarty truncate modifier plugin
 *
 * @author   shogo < shogo4405 at gmail dot com>
 * @version  1.0.0
 * @see      http://smarty.php.net/manual/en/language.modifier.strip_tags.php
 * @param    {Object} params
 * @param    {JSmarty} jsmarty
 * @return   {String} string with tags removed
 */
function jsmarty_modifier_strip_tags(string, replace_with_space)
{
	if(replace_with_space == void(0))
		replace_with_space = true;

	if(replace_with_space)
		return string.replace(/<[^>]*?>/,' ');
	else
		return string.replace(/<[^>]*?>/,'');
};