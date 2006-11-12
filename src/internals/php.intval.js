/**
 * intval function
 *
 * @author shogo < shogo4405 at gmail dot com >
 * @version 0.9.0
 * @see http://www.php.net/intval
 * @param  {mixed} low
 * @param  {Number} base
 * @return {Number}
 */
function intval(v, base)
{
	if(base && typeof(v) == 'string')
		return parseInt(v).toString(base);
	return parseInt(v);
};