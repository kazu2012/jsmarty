/**
 * Smarty plugin
 * @package Smarty
 * @subpackage plugins
 */
function jsmarty_outputfilter_trimwhitespace(source, jsmarty)
{
	var pretxt = /<pre>.*?<\/pre>/ig
	var script = /<script[^>]+>.*?<\/script>/ig;
	var txtara = /<textarea[^>]+>.*?<\/textarea>/ig

	var script_block = '';
	source = source.replace(script, '@@@JSMARTY:TRIM:SCRIPT@@@');

	var pretxt_block = '';
	source = source.replace(pretxt, '@@@JSMARTY:TRIM:PRE@@@');

	var txtara_block = '';
	source = source.replace(txtara, '@@@JSMARTY:TRIM:TEXTAREA@@@');

	return source;
};

function jsmarty_outputfilter_trimwhitespace_replace(search_str, replace, subject)
{
	
};