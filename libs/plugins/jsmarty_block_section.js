/**
 * JSmarty plugin
 * @package JSmarty
 * @subpackage plugins
 */

jsmarty_block_section = function(params, content, smarty)
{
	var html = [];
	var name = params.name;
	var loop = params.loop;
	var step = params.step || 1;
	var show = params.show || true;

	for(var i=0,fin=loop.length-1;i<fin;i+=step){
		html.push(content.call(smarty, i));
	}

	return html.join('');
}