/**
 * strpos function
 *
 * @author shogo < shogo4405 at gmail dot com >
 * @version 1.0.0
 * @see http://www.php.net/strpos
 * @param  {String} s haystack
 * @param  {String} n needle
 * @param  {Number} o offset
 * @return {Number | Boolean}
 */
function strpos(s, b, o)
{
	var v = s.indexOf(n, o || 0);
	return (v == -1) ? false : v;
};