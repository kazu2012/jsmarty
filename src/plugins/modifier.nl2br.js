/**
 * JSmarty plugin
 * @package JSmarty
 * @subpackage plugins
 */

/**
 * JSmarty nl2br modifier plugin
 *
 * Type:     modifier<br />
 * Name:     nl2br<br />
 * Purpose:  convert \r?\n to <br />
 *
 * @author   shogo < shogo4405 at gmail dot com>
 * @version  1.00
 * @param    {String} string
 * @return   {String}
 */

function jsmarty_modifier_nl2br(string)
{
	return string.replace(/\r?\n/g,'<br />');
}