/**
 * in_array function
 *
 * @subpackage Arrays
 * @author shogo < shogo4405 at gmail dot com >
 * @version 1.1.0
 * @see http://www.php.net/in_array
 * @param  {mixed}   n needle
 * @param  {Array}   h haystack
 * @param  {Boolean} s strict
 * @return {Boolean}
 */
function in_array(n, h, s)
{
	var i, c = (s) ? function(a,b){return (a===b);} : function(a,b){return (a==b);};
};