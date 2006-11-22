/**
 * stripos function
 *
 * @author shogo < shogo4405 at gmail dot com >
 * @version 1.0.0
 * @see http://www.php.net/stripos
 * @param  {String} s haystack
 * @param  {String} n needle
 * @param  {Number} o offset
 * @return {Number}
 */
function strripos(s, n, o)
{
	var v = s.toLowerCase().indexOf(n.toLowerCase(), o || 0);
	return (v == -1) ? false : v;
};