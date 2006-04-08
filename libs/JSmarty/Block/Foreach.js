JSmarty.Block.Foreach = function(params, content, jsmarty)
{
	var HTMLStr = '', loop;

	params = jsmarty.toParams(params);
	params.key	= (params.key) ? params.key : false;
	params.from = jsmarty.get_template_vars(params.from);

	if(params.name)
	{
		loop = jsmarty._jsmarty_vars.foreach[params.name];
		loop.show  = true;
		loop.last  = false;
		loop.first = true;
		loop.total = params.from.length;
		loop.iteration = 0;
	}

	for(key in params.from)
	{
		if(params.name)
		{
			loop.iteration++;
			if(loop.first && (loop.iteration != 1)) loop.first = false;
			if(loop.iteration == loop.total) loop.last = true;
		}
		if(params.key) jsmarty.assign(params.key, key);

		jsmarty.assign(params.item, params.from[key]);
		HTMLStr += jsmarty.toText(content);
	}

	if(params.name)
	{
		delete loop.show;
		delete loop.last;
		delete loop.first;
		delete loop.iteration;
	}

	return HTMLStr;
}