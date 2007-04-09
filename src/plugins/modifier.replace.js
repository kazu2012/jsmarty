/**
 * JSmarty plugin
 * @package JSmarty
 * @subpackage plugins
 */

/**
 * JSmarty replace modifier plugin
 *
 * Type:     modifier<br />
 * Name:     replace<br />
 *
 * @author   shogo < shogo4405 at gmail dot com>
 * @version  1.0.0RC1
 * @see      http://smarty.php.net/manual/en/language.modifier.replace.php
 * @param    {String} s string
 * @param    {String} e search
 * @param    {String} r replace
 * @return   {String} string with replaced
 */
function jsmarty_modifier_replace(s, e, r)
{
	var i = 0;
	while((i = s.indexOf(e, i)) != -1){
		s = s.replace(e, r);
	};
	return s;
};