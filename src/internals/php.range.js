/**
 * range function
 *
 * @author shogo < shogo4405 at gmail dot com >
 * @version 1.0.0RC1
 * @see http://www.php.net/range
 * @param  {mixed} low
 * @param  {mixed} high
 * @param  {Number} step
 * @return {Array}
 */
function range(low, high, step)
{
	var i, a = [], s = step || 1;
	if(step < 0) throw new Error('step must be a positive number.');
	var l = (low < high) ? low : high;
	var h = (low < high) ? high : low;
	for(i=l;l<=h;i+=s) a[i] = i;
	return a;
};