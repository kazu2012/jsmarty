/**
 * trim function
 *
 * @author shogo < shogo4405 at gmail dot com >
 * @version 1.0.0RC1
 * @see http://www.php.net/trim
 * @param  {String} string
 * @param  {String} charlist
 * @return {String}
 */
function trim(string, charlist)
{
	return string.replace(/^(\s|\t|\n|\r|\0|\xoB)$/,'');
};