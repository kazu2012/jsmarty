/**
 * in_array function
 *
 * @package Arrays
 * @author shogo < shogo4405 at gmail dot com >
 * @version 1.0.2
 * @see http://www.php.net/in_array
 * @param  {mixed} n needle
 * @param  {Array} h haystack
 * @return {Boolean}
 */
function in_array(n, h)
{
	var i=0, f = h.length;
	while(i<f) if(n == h[i++]) return true;
	return false;
};