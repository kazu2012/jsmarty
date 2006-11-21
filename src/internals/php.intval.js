/**
 * intval function
 *
 * @author shogo < shogo4405 at gmail dot com >
 * @version 0.9.0
 * @see http://www.php.net/intval
 * @param  {mixed} v value
 * @param  {Number} b base
 * @return {Number}
 */
function intval(v, b)
{
	if(base && typeof(v) == 'string')
		return parseInt(v).toString(b);
	return parseInt(v);
};