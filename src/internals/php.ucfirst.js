/**
 * ucfirst function
 *
 * @author shogo < shogo4405 at gmail dot com >
 * @version 1.0.0
 * @see http://www.php.net/ucfirst
 * @param  {String} s
 * @return {String}
 */
function ucfirst(s){
	return s.charAt(0).toUpperCase() + s.slice(1);
};