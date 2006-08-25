/**
 * JSmarty plugin
 * @package JSmarty
 * @subpackage plugins
 */

function jsmarty_block_foreach(params, content, smarty)
{
	if(!params.from) return '';

	var i, html = [];
	var from = params.from;
	var key  = params.key  || false;
	var item = params.item || false;
	var name = params.name || false;

	if(name)
	{
		var total = 0;

		for(i in from)
		{
		}
		return html.join('');
	}

	for(i in from)
	{
		if(key) smarty.assign(key, i);
		smarty.assign(item, from[i]);
		html.push(content);
	}

	return html.join('');
};