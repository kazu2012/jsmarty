/**
 * JSmarty plugin
 * @package JSmarty
 * @subpackage plugins
 */

/**
 * escape_special_chars shared function
 *
 * Function : jsmarty_shared_escape_special_chars
 * @author shogo < shogo4405 at gmail dot com >
 * @param  string
 * @return string
 */
function jsmarty_shared_escape_special_chars(string)
{
	if(typeof(string) == 'object')
		string = string.toString();

	string = JSmarty.Plugin.getFunction('php.htmlspecialchars')(string);

	return string;
};