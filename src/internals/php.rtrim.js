/**
 * rtrim function
 *
 * @author shogo < shogo4405 at gmail dot com >
 * @version 1.0.0RC2
 * @see http://www.php.net/rtrim
 * @param  {String} s string
 * @param  {String} c charlist
 * @return {String}
 */
function rtrim(s, c)
{
	c = (c) ? c : '[\\s\\t\\n\\r\\0\\v]';
	return s.replace(RegExp(c +'*$'),'');
};