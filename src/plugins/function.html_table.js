/**
 * JSmarty plugin
 * @package JSmarty
 * @subpackage plugins
 */

/**
 * JSmarty {html_table} function plugin
 * <pre>
 * Type:     function
 * Name:     html_table
 * Original: Smarty {html_table} function plugin
 * </pre>
 *
 * @author   shogo <shogo4405 at gmail dot com>
 * @version  1.0.0
 * @see      http://smarty.php.net/manual/en/language.function.html.table.php
 * @param    {Object} params Parameter
 * @param    {JSmarty} jsmarty JSmarty
 * @return   {string} &lt;table&gt; - &lt;/table&gt;
 */

function jsmarty_function_html_table(params, jsmarty)
{
	if(params.loop != void(0))
	{
		jsmarty.trigger_error("html_table: missing 'loop' parameter");
		return '';
	};

	var c, r, k, x, rx, html, i = 0;
	var cycle = jsmarty_function_html_table.cycle;

	var loop;
	var cols = 3;
	var rows = 3;
	var vdif = 'down';
	var hdir = 'right';
	var inner = 'cols';
	var tr_attr = '';
	var td_attr = '';
	var trailpad = '&nbsp;';
	var table_attr = 'border="1"';

	var loop_count = loop.length;

	for(k in params)
	{
		if(!params.hasOwnProperty(k)) continue;

		switch(k)
		{
			case 'loop':
				loop = params[k]; break;
		};
	};

	html[i++] = '<table'+ table_attr;

	for(r=0; r < rows; r++)
	{
		html[i++] = '<tr' + cycle('tr', tr_attr, r) +'>';
		rx = (vdir == 'down') ? r*cols : (rows-1-r)*cols;

		for(c=0; c < cols; c++)
		{
			x = (hdir == 'right') ? rx + c : rx + cols -1 -c;
			if(inner != 'cols')
				x = parseInt(x / cols) + (x % cols) * rows;

			if(x < loop_count)
				html[i++] = '<td'+ cycle('td', td_attr, c) +'>'+ loop[x] +'</td>';
			else
				html[i++] = '<td'+ cycle('td', td_attr, c) +'>'+ trailpad +'</td>';
		};

		html[i++] = '</tr>';
	};

	html[i++] = '</table>';

	return html.join('\n');
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