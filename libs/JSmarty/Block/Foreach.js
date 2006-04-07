JSmarty.Block.Foreach = function(params, content, jsmarty)
{
	var HTMLStr = '';

	params = jsmarty.toParams(params);
	params.from	= jsmarty.get_template_vars(params.from);
	params.key	= (typeof params.key == 'undefined') ? false : params.key;

	for(i in params.from)
	{
		if(params.key) jsmarty.assign(params.key, i);
		jsmarty.assign(params.item, params.from[i]);
		HTMLStr += jsmarty.toText(content);
	}

	return HTMLStr;
}