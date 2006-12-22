/**
 * JSmarty plugin
 * @package JSmarty
 * @subpackage plugins
 */

/**
 * JSmarty {fetch} function plugin
 *
 * Type:     function<br />
 * Name:     fetch<br />
 * Original: Smarty {fetch} function plugin
 *
 * @author   shogo < shogo4405 at gmail dot com>
 * @version  1.0.0RC1
 * @see      http://smarty.php.net/manual/en/language.function.fetch.php
 * @param    {Object}  params parameters
 * @param    {JSmarty} jsmarty JSmarty
 * @return   {String}
 */
function jsmarty_function_fetch(params, jsmarty)
{
	if(!params.file)
	{
		jsmarty.trigger_error('fetch : parameter "file" cannot be empty','die');
		return;
	};

	var content = '';

	content = JSmarty.System.fgets(params.file, jsmarty.template_dir);

	if(params.assign)
		jsmarty.assign(params.assign, content);
	else
		return content;
};