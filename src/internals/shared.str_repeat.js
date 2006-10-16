/**
 * JSmarty plugin
 * @package JSmarty
 * @subpackage plugins
 */

/**
 * str_repeat shared function
 *
 * @author shogo < shogo4405 at gmail dot com >
 * @version 1.0.0
 * @see http://www.php.net/str_repeat
 * @param  {String} input_str
 * @param  {Number} multiplier
 * @return {String}
 */
function jsmarty_shared_str_repeat(input_str, multiplier)
{
	var i, ary = [];

	for(i=0;i<=multiplier;i++)
		ary[i] = input_str;

	return ary.join('');
};