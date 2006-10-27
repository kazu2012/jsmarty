/**
 * array_values function
 *
 * @author shogo < shogo4405 at gmail dot com >
 * @version 1.0.0
 * @see http://www.php.net/array_values
 * @param  {Object} input
 * @return {Array}
 */
function array_values(input)
{
	var k, i = 0, ary = new Array();
	for(k in input)
	{
		if(!input.hasOwnProperty(k)) continue;
		ary[i++] = input[k];
	};
	return ary;
};