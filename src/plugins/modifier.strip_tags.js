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
 * @version  1.0.1
 * @see      http://smarty.php.net/manual/en/language.modifier.strip_tags.php
 * @param    {String} s string
 * @param    {String} r replace_with_space
 * @return   {String} string with tags removed
 */
function jsmarty_modifier_strip_tags(s, r)
{
	if(!!r){
		return s.replace(/<[^>]*?>/g,' ');
	};
	return s.replace(/<[^>]*?>/g,'');
};