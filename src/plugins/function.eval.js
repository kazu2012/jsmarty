/**
 * Smarty plugin
 * @package Smarty
 * @subpackage plugins
 */

/**
 * JSmarty {eval} function plugin
 * 
 * Type:     function<br />
 * Name:     eval<br />
 * 
 * @author   shogo < shogo4405 at gmail dot com>
 * @version  0.0.0
 * @see      http://smarty.php.net/manual/en/language.function.eval.php
 * @param    {Object} params
 * @param    {JSmarty} jsmarty
 * @return   {String}
 */
function jsmarty_function_eval(params, jsmarty)
{
	if(params['var'] == void(0))
	{
		jsmarty.trigger_error("eval: missing 'var' parameter");
		return;
	};

	if(params['var'] == '')
		return;

	var contents = '';

	if(!params.assign)
		jsmarty.assign(params.assign, contents);

	return contents;
};