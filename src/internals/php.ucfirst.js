/**
 * ucfirst function
 *
 * @author shogo < shogo4405 at gmail dot com >
 * @version 1.0.0
 * @see http://www.php.net/ucfirst
 * @param  {String} string
 * @return {String}
 */
function ucfirst(string)
{
	return string.charAt(0).toUpperCase() + string.slice(1);
};