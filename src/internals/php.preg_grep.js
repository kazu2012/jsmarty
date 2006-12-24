/**
 * preg_grep function
 *
 * @subpackage PCRE
 * @author shogo < shogo4405 at gmail dot com >
 * @version 1.0.0RC1
 * @see http://www.php.net/preg_grep
 * @param  {RegExp} p pattern
 * @param  {Array}  i input
 * @param  {String} f flags
 * @return {Array}
 */
function preg_grep(p, b, f)
{
	var i, f, a = (b.length == 1) ? [b] : Array.apply(null, b);
	var c = (f == 'PREG_GREP_INVERT') ? function(b){ return b; } : function(b){ return !b; };
	for(i=0,f=b.length;i<f;i++) if(c(a[i].match(p))) delete a[i];
	return a;
};