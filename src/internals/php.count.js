/**
 * count function
 *
 * @subpackage Arrays
 * @author shogo < shogo4405 at gmail dot com >
 * @version 0.5.0
 * @see http://www.php.net/count
 * @param  {mixed} v var
 * @param  {String} m mode
 * @return {Array}
 */
function count(v, m)
{
	if(v == null) return 0;
	var k, i = 0; for(k in v) i++;
	return i;
};