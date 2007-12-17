/**
 * str_tr function
 *
 * @subpackages Strings
 * @author shogo < shogo4405 at gmail dot com >
 * @version 1.0.0RC1
 * @see http://www.php.net/str_tr
 */
function strtr(s, p, r)
{
	if(arguments.length == 3){ return s.replace(p, r); };
	var i, o = arguments[1];
	for(i in o){ s = strtr(s, i, o[i]); };
	return s;
};
