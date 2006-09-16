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
 * Original: Smarty {html_table} function plugin<br />
 *
 * @author   shogo <shogo4405 at gmail dot com>
 * @version  1.0.0
 * @see      http://smarty.php.net/manual/en/language.function.html.table.php
 * @param    {Object} params
 * @param    {JSmarty} jsmarty
 * @return   {string} &lt;table&gt; - &lt;/table&gt;
 */

function jsmarty_function_html_table(params, jsmarty)
{
	if(!params.loop)
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
			case 'cols':
				cols = parseInt(params[k]);
			case 'rows':
				rows = parseInt(params[k]);
			case 'hdir':
				hdir = String(params[k]);
			case 'vdir':
				vdir = String(params[k]);
			case 'inner':
				inner = String(params[k]);
			case 'trailpad':
				trailpad = String(params[k]);
			case 'table_attr':
				table_attr = String(params[k]);
			case 'tr_attr':
				tr_attr = params[k];
			case 'td_attr':
				td_attr = params[k];
		};
	};

	if(params.rows == void(0))
		rows = Math.ceil(loop_count / cols);
	else if(params.cols == void(0))
	{
		if(params.cols != void(0))
			cols = Math.ceil(loop_count / rows);
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
				x = Math.floor(x / cols) + (x % cols) * rows;

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