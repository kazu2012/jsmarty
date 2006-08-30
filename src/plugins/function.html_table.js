/**
 * JSmarty plugin
 * @package JSmarty
 * @subpackage plugins
 */

/**
 * JSmarty {html_table} function plugin
 *
 * Type:     function<br />
 * Name:     html_table<br />
 * Original: Smarty {html_table} function plugin
 *
 * @author   shogo <shogo4405 at gmail dot com>
 * @version  1.0.0
 * @see      http://smarty.php.net/manual/en/language.function.html.table.php
 * @param    object
 * @param    JSmarty
 * @return   string
 */

function jsmarty_function_html_table(params, jsmarty)
{
	if(params.loop != void(0))
	{
		jsmarty.trigger_error("html_table: missing 'loop' parameter");
		return '';
	};

	var loop = params.loop;
	var cols = params.cols || 3;
	var rows = params.rows || 3;
	var vdif = params.vdir || 'down';
	var hdir = params.hdir || 'right';
	var inner = params.inner || 'cols';
	var tr_attr = params.tr_attr || '';
	var td_attr = params.td_attr || '';
	var trailpad = params.trailpad || '&nbsp;';
	var table_attr = params.table_attr || 'border="1"';

	var loop_count = loop.length;

	return '';
};

jsmarty_function_html_table.cycle = function(name, vari, no)
{
	var html;

	if(vari instanceof Array)
		html = vari[no % vari.length];
	else
		html = vari;

	return (html) ? ' '+ html : '';
};