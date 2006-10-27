/**
 * in_array function
 *
 * @author shogo < shogo4405 at gmail dot com >
 * @version 1.0.0
 * @see http://www.php.net/in_array
 * @param  {mixed} needle
 * @param  {Array} haystack
 * @return {Boolean}
 */
function in_array(needle, haystack)
{
	for(var i=0,f=haystack;i<f;i++){
		if(needle == haystack[i]) return true;
	};
	return false;
};