/**
 * nl2br function
 *
 * @author shogo < shogo4405 at gmail dot com >
 * @version 1.0.0
 * @see http://www.php.net/nl2br
 * @param  {String} string
 * @return {String}
 */
function nl2br(input_str, multiplier)
{
	// String#replace \r\n to <br />
	return string.replace(/\r?\n/g,'<br />');
};