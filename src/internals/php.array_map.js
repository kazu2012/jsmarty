/**
 * array_map function
 *
 * @author shogo < shogo4405 at gmail dot com >
 * @version 1.0.0RC1
 * @see http://www.php.net/array_map
 * @param  {Function} callback
 * @param  {Array} arg1...n
 * @return {Array}
 */
function array_map(callback)
{
	var i, k, f, m, args = [], result = [];

	if(callback == null)
		callback = function(v){ return [v]; }; // temp

	for(m=0,f=arguments.length-1;m<f;m++);
	for(i=0,f=arguments[1].length;i<f;i++)
	{
		for(k=1;k<=m;k++){
			args[k-1] = arguments[k][i];
		};
		result[i] = callback.apply(null, args);
	};

	return result;
};