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
 * @version  1.0.0RC2
 * @see      http://smarty.php.net/manual/en/language.function.fetch.php
 * @param    {Object}  params parameters
 * @param    {JSmarty} jsmarty JSmarty
 * @return   {String}
 */
function jsmarty_function_fetch(params, jsmarty)
{
	var name, cache, caches = jsmarty_function_fetch.caches;

	if(!('file' in params)){
		jsmarty.trigger_error('fetch : parameter "file" cannot be empty', 'die');
		return;
	};

	name = jsmarty.getResourceName(params.file);
	cache = caches[name] || function()
	{
		caches[name] = JSmarty.Classes.Item.fetch(name, jsmarty);
		return caches[name];
	}();

	if(params.assign)
	{
		jsmarty.assign(params.assign, cache.get('src'));
		return;
	};

	return cache.get('src');
};

jsmarty_function_fetch.caches = {};