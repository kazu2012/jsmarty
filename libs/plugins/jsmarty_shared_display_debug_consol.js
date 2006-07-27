/**
 * JSmarty plugin
 * @package JSmarty
 * @subpackage plugins
 */

jsmarty_shared_display_debug_consol = function(params, smarty)
{
	var compid, ldelim, rdelim, result;

	if(!smarty.debug_tpl)
		smarty.debug_tpl = 'debug.tpl';

	ldelim = smarty.left_delimiter;
	rdelim = smarty.right_delimiter;
	compid = smarty._compile_id;

	smarty._compile_id = null;
	smarty.left_delimiter = '{';
	smarty.right_delimiter = '}';

	smarty._compile_id = compid;
	smarty.left_delimiter = ldelim;
	smarty.right_delimiter = rdelim;

	if(smarty._compile_source(smarty.debug_tpl))
		result = JSmarty.templates_c[smarty.debug_tpl].call(smarty);
	else
		result = '';

	return '';
};