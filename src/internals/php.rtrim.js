/**
 * rtrim function
 *
 * @author shogo < shogo4405 at gmail dot com >
 * @version 1.0.0RC1
 * @see http://www.php.net/rtrim
 * @param  {String} string
 * @param  {String} charlist
 * @return {String}
 */
function rtrim(string, charlist)
{
	charlist = (charlist) ? charlist : '[\\s\\t\\n\\r\\0\\v]';
	return string.replace(RegExp(charlist +'*$'),'');
};