/**
 * JSmarty plugin
 * @package JSmarty
 * @subpackage plugins
 */

/**
 * JSmarty count_words modifier plugin
 *
 * Type:     modifier<br />
 * Name:     count_words<br />
 *
 * @author   shogo < shogo4405 at gmail dot com>
 * @version  1.0.0
 * @see      http://smarty.php.net/manual/en/language.modifier.count.words.php
 * @param    {String} string
 * @return   {Number}
 */
function jsmarty_modifier_count_words(string)
{
	var preg_grep = JSmarty.Plugin.getFunction('php.preg_grep');
	var split = string.split(/\s+/);
	var words = preg_grep(/[a-zA-Z0-9\x80-\xff]/, split);
	return JSmarty.Plugin.getFunction('php.count')(words);
};