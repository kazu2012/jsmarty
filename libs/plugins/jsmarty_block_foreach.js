jsmarty_block_foreach = function(params, content, smarty)
{
	var key, from, item, name;
	var loop = false, html = [], total = 0;

	if(!(from = params.from)) return '';

	key = params.key  || false;
	item= params.item || false;
	name= params.name || false;

	if(name)
	{
		return html.join('');
	}

	for(var i in from)
	{
		if(key) smarty.assign(key, i);
		smarty.assign(item, from[i]);
		html.push(smarty.parser(content));
	}

	return html.join('');
};