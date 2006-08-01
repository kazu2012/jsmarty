function jsmarty_function_counter(params, smarty)
{
	var counters = jsmarty_function_counter.counters;
	var retval, print, counter, name = params.name || 'default';

	if(!counters[name])
	{
		counters[name] =
		{
			start: 1,
			skip : 1,
			count: 1,
			direction : 'up'
		};
	}

	counter = counters[name];

	if(params.start != void(0))
		counter.start = counter.count = params.start - 0;

	if(!params.assign)
		counter.assign = params.assign;

	if(counter.assign)
		smarty.assign(counter.assign, counter.count);

	if(params.print)
		print = new Boolean(params.print);
	else
		print = (counter.assign != 0 && !counter.assign) ? true : false;

	if(print)
		retval = counter.count;
	else
		retval = '';

	if(params.skip)
		counter.skip = params.skip;

	if(params.direction)
		counter.direction = params.direction;

	if(counter.direction == 'down')
		counter.count -= counter.skip - 0;
	else
		counter.count += counter.skip - 0;

	return retval;
}
/** static counters **/
jsmarty_function_counter.counters = {};