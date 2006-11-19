/**
 * is_numeric function
 *
 * @author shogo < shogo4405 at gmail dot com >
 * @version 1.0.0
 * @see http://www.php.net/is_numeric
 * @param  {mixed} v
 * @return {Boolean}
 */
function is_numeric(v){
	return (!isNaN(Number(v)));
};