/**
 * trim function
 *
 * @author shogo < shogo4405 at gmail dot com >
 * @version 1.0.0RC3
 * @see http://www.php.net/trim
 * @param  {String} s string
 * @param  {String} c charlist
 * @return {String}
 */
function trim(s, c)
{
	c = (c) ? c : '[\\s\\t\\n\\r\\0\\v]';
	return s.replace(RegExp('^'+ c +'*|'+ c +'*$','g'),'');
};