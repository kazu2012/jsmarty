/**
 * str_split function
 *
 * @author shogo < shogo4405 at gmail dot com >
 * @version 1.0.0
 * @see http://www.php.net/str_split
 * @param  {String} s
 * @param  {Number} l
 * @return {Array | Boolean}
 */
function str_split(s, l)
{
	if(l < 1) return false;
	if(l == void(0)) l = 1;
	var i = 0, k = 0, f = s.length - 1, a = [];
	for(;i<=f;i+=l,k++) a[k] = s.slice(i, i+l);
	return a;
};