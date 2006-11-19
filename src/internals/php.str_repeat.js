/**
 * str_repeat function
 *
 * @author shogo < shogo4405 at gmail dot com >
 * @version 1.0.0
 * @see http://www.php.net/str_repeat
 * @param  {String} s input_str
 * @param  {Number} m multiplier
 * @return {String}
 */
function str_repeat(s, m){
	return new Array(m + 1).join(s);
};