/**
 * range function
 *
 * @author shogo < shogo4405 at gmail dot com >
 * @version 1.0.0RC2
 * @see http://www.php.net/range
 * @param  {mixed} low
 * @param  {mixed} high
 * @param  {Number} step
 * @return {Array}
 */
function range(low, high, step)
{
	var i, k = 0, a = [], s = step || 1;
	if(s <= 0) throw new Error('step must be a positive number.');
	var l = (low < high) ? low : high, h = (low < high) ? high : low;
	for(i=l;i<=h;i+=s) a[k++] = i;
	return a;
};