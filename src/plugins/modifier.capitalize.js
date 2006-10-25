/**
 * JSmarty plugin
 * @package JSmarty
 * @subpackage plugins
 */

/**
 * JSmarty capitalize modifier plugin
 *
 * Type:     modifier<br />
 * Name:     capitalize<br />
 * @param {String}
 * @return {String}
 */

var jsmarty_modifier_capitalize_digits = false;

function jsmarty_modifier_capitalize(string, digits)
{
	if(digits == void(0)) digits = false;
	jsmarty_modifier_capitalize_ucfirst(null, digits);
	return string.replace(/\b\w+\b/, jsmarty_modifier_capitalize_ucfirst);
};

function jsmarty_modifier_capitalize_ucfirst(string, digits)
{
	var ucfirst = JSmarty.Plugin.getFunction('php.ucfirst');

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