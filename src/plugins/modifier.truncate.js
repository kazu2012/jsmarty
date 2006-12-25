/**
 * JSmarty plugin
 * @package JSmarty
 * @subpackage plugins
 */

/**
 * JSmarty truncate modifier plugin
 *
 * Type:     modifier<br />
 * Name:     truncate<br />
 * Original: Smarty truncate modifier plugin
 *
 * @author   shogo < shogo4405 at gmail dot com>
 * @version  1.0.0
 * @see      http://smarty.php.net/manual/en/language.modifier.truncate.php
 * @param    {String} string
 * @param    {Number} length
 * @param    {String} etc
 * @param    {String} break_words
 * @param    {Boolean} middle
 * @return   {String}
 */
function jsmarty_modifier_truncate(string, length, etc, break_words, middle)
{
	length = (length) ? Number(length) : 80;

	if(length == 0) return '';
	if(etc == void(0)) etc = '...';
	if(middle == void(0)) middle = false;
	if(break_words == void(0)) break_words = false;

	if(string.length > length)
	{
		length -= etc.length;
		if(!break_words && !middle)
			string = string.replace(/\s+?(\S+)?$/,'').slice(0, length+1);
		if(!middle)
			return string.slice(0, length) + etc;
		else
			return string.slice(0, length/2) + etc + string.slice(-length/2);
	};

	return string;
};