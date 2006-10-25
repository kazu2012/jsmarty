/**
 * JSmarty plugin
 * @package JSmarty
 * @subpackage plugins
 */

/**
 * Smarty capitalize modifier plugin
 *
 * Type:     modifier<br>
 * Name:     capitalize<br>
 * Purpose:  capitalize words in the string
 * @link http://smarty.php.net/manual/en/language.modifiers.php#LANGUAGE.MODIFIER.CAPITALIZE
 *      capitalize (Smarty online manual)
 * @author   Monte Ohrt <monte at ohrt dot com>
 * @param string
 * @return string
 */

var ucfirst = JSmarty.Plugin.getFunction('php.ucfirst');
var jsmarty_modifier_capitalize_digits = false;

function jsmarty_modifier_capitalize(string, digits)
{
	if(digits == void(0)) digits = false;
	jsmarty_modifier_capitalize_ucfirst(null, digits);
	return string.replace(/\b\w+\b/, jsmarty_modifier_capitalize_ucfirst);
};

function jsmarty_modifier_capitalize_ucfirst(string, digits)
{
	if(digits != void(0))
	{
		jsmarty_modifier_capitalize_digits = digits;
		return;
	};
	if(string[0].match(/\d/) || jsmarty_modifier_capitalize_digits)
		return ucfirst(string[0]);
	else
		return string[0];
};