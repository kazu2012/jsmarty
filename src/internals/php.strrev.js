/**
 * strrev function
 *
 * @author shogo < shogo4405 at gmail dot com >
 * @version 1.0.0
 * @see http://www.php.net/strrev
 * @param  {String} s string
 * @return {String}
 */
function strrev(s)
{
	var i,f,a = Array(s.length-1);
	for(i=0,f=s.length-1;i<=f;i++)
		a[i] = s.charAt(f-i);
	return a.join('');
};