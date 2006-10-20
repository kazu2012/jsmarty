/**
 * JSmarty plugin
 * @package JSmarty
 * @subpackage plugins
 */

/**
 * JSmarty wordwrap modifier plugin
 *
 * Type:     modifier<br />
 * Name:     wordwrap<br />
 *
 * @author   shogo < shogo4405 at gmail dot com>
 * @version  1.0.0
 * @see      http://smarty.php.net/manual/en/language.modifier.wordwrap.php
 * @param    {String} string
 * @param    {Number} length
 * @param    {String} separator
 * @param    {Boolean} cut
 * @return   {String}
 */
function jsmarty_modifier_wordwrap(string, length, separator, cut)
{
	if(cut == void(0)) cut = false;
	if(length == void(0)) length = 80;
	if(separator == void(0)) separator = '\n';

	return JSmarty.Plugin.getFunction('php.wordwrap')(string, length, separator, cut);
};