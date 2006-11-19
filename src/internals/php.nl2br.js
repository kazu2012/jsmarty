/**
 * nl2br function
 *
 * @author shogo < shogo4405 at gmail dot com >
 * @version 1.0.0
 * @see http://www.php.net/nl2br
 * @param  {String} s string
 * @return {String}
 */
function nl2br(s){
	return s.replace(/\r?\n/g,'<br />');
};