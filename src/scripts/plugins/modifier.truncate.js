/**
 * JSmarty plugin
 * @package JSmarty
 * @subpackage plugins
 */

/**
 * JSmarty truncate modifier plugin
 *
 * Type:     modifier<br />
 * Name:     truncate<br />
 * Original: Smarty truncate modifier plugin
 *
 * @author   shogo < shogo4405 at gmail dot com>
 * @version  1.0.1
 * @see      http://smarty.php.net/manual/en/language.modifier.truncate.php
 * @param    {String} s string
 * @param    {Number} l length
 * @param    {String} e etc
 * @param    {String} b break_words
 * @param    {Boolean} m middle
 * @return   {String}
 */
function jsmarty_modifier_truncate(s, l, e, b, m)
{
	l = (l) ? Number(l) : 80;

	if(l == 0){ return; };
	if(e == void(0)){ e = '...' };
	if(m == void(0)){ m = false; };
	if(b == void(0)){ b = false; };

	if(s.length > length)
	{
		l -= e.length;
		if(!b && !m){ s = s.replace(/\s+?(\S+)?$/,'').slice(0, l + 1); };
		return (!m) ? s.slice(0, l) + e : s.slice(0, l/2) + e + s.slice(-l/2);
	};

	return s;
};