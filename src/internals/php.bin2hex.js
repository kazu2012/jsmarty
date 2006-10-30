/**
 * bin2hex function
 *
 * @author shogo < shogo4405 at gmail dot com >
 * @version 0.0.0
 * @see http://www.php.net/bin2hex
 * @param  {String} s
 * @return {String}
 */
function bin2hex(s)
{
	var i, f, a = [];
	for(i=0,f=s.length;i<f;i++)
		a[i] = s.charCodeAt(i).toString(16);
	return a.join('');
};