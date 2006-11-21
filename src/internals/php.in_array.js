/**
 * in_array function
 *
 * @author shogo < shogo4405 at gmail dot com >
 * @version 1.0.1
 * @see http://www.php.net/in_array
 * @param  {mixed} n needle
 * @param  {Array} h haystack
 * @return {Boolean}
 */
function in_array(n, h)
{
	var i=0, f = h.length;
	for(;i<f;i++) if(n == h[i]) return true;
	return false;
};