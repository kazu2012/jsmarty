/**
 * strrev function
 *
 * @author shogo < shogo4405 at gmail dot com >
 * @version 1.0.0
 * @see http://www.php.net/strrev
 * @param  {String} s string
 * @return {String}
 */
function strrev(s){
	return s.split('').reverse().join('');
};