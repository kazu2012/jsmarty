/**
 * JSmarty plugin
 * @package JSmarty
 * @subpackage plugins
 */

/**
 * JSmarty {assign} compiler plugin
 *
 * Type:     conmpiler<br />
 * Name:     assign<br />
 * Original: Smarty {assign} compiler plugin
 *
 * @author   shogo < shogo4405 at gmail dot com>
 * @version  0.0.0
 * @param    {String} attrs
 * @param    {JSmarty.Compiler} compiler
 * @return   {String}
 */
function jsmarty_compiler_assign(attrs, compiler)
{
	var params = compiler._parse_attrs(attrs);
	return "";
};