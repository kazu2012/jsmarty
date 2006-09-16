/**
 * JSmarty plugin
 * @package JSmarty
 * @subpackage plugins
 */

/**
 * JSmarty {include} function plugin
 *
 * Type:     function<br />
 * Name:     include<br />
 *
 * @author   shogo < shogo4405 at gmail dot com>
 * @version  0.0.1
 * @param    {Object} params
 * @param    {JSmarty} jsmarty
 * @return   {String}
 */
function jsmarty_function_include(params, jsmarty)
{
	if(!params.file)
	{
		self.trigger_error('include : missing "file" parameter.');
		return '';
	};
	var k, html = '';

	var file = params.file;
	var assign = params.assign || false;

	delete params.file;
	delete params.assign;

	// merge variables
	for(k in params)
		jsmarty._tpl_vars[i] = params[i];

	if(jsmarty._is_compiled(file) || jsmarty._compile_resource(file)){
		html = JSmarty.templates_c[file].call(jsmarty);
	};

/*
	if(jsmarty.caching)
		jsmarty._cache_info['template'][file] = true;
*/

	return html;
};