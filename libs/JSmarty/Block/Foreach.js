JSmarty.Block.Foreach = function(params, content, JSmarty)
{
	var HTMLStr = '', loop;

	params.key	= (params.key) ? params.key : false;
	params.from = JSmarty.get_template_vars(params.from);

	if(params.name)
	{
		loop = JSmarty._jsmarty_vars.foreach[params.name];
		loop.show  = true;
		loop.last  = false;
		loop.first = true;
		loop.total = params.from.length;
		loop.iteration = 0;
	}

	for(i in params.from)
	{
		if(params.name)
		{
			loop.iteration++;
			if(loop.first && (loop.iteration != 1)) loop.first = false;
			if(loop.iteration == loop.total) loop.last = true;
		}
		if(params.key) JSmarty.assign(params.key, i);

		JSmarty.assign(params.item, params.from[i]);
		HTMLStr += JSmarty.parser(content);
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