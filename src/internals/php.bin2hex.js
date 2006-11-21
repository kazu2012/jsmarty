/**
 * bin2hex function
 *
 * @author shogo < shogo4405 at gmail dot com >
 * @version 1.0.0RC1
 * @see http://www.php.net/bin2hex
 * @param  {String} s
 * @return {String}
 */
function bin2hex(s)
{
	var i = 0, f = s.length, a = [];
	for(;i<f;i++) a[i] = s.charCodeAt(i).toString(16);
	return a.join('');
};