/**
 * str_repeat function
 *
 * @author shogo < shogo4405 at gmail dot com >
 * @version 1.0.0
 * @see http://www.php.net/str_repeat
 * @param  {String} input_str
 * @param  {Number} multiplier
 * @return {String}
 */
function str_repeat(input_str, multiplier)
{
	return Array(multiplier + 1).join(input_str);
};