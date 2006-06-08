JSmarty.Function.cycle = function($params, $smarty)
{
	var $retval, $cycle_array;
	var $name, $print, $advance, $reset;
	var $cycle_vars = JSmarty.Function.cycle.$cycle_vars;

	$name    = $params['name'] || 'default';
	$print   = ($params['print'] == (void 0)) ? true  : $params['print'];
	$reset   = ($params['reset'] == (void 0)) ? false : $params['reset'];
	$advance = ($params['advance']==(void 0)) ? true  : $params['advance'];

	if($cycle_vars[$name] == (void 0))
		$cycle_vars[$name] = {};

	if(!$params['values'])
	{
		if(!$cycle_vars[$name]['values'])
		{
			$smarty.trigger_error("cycle: missing 'values' parameter");
			return '';
		}
	}
	else
	{
		if(!$cycle_vars[$name]['values'] && $cycle_vars[$name]['values'] != $params['values'])
			$cycle_vars[$name]['index'] = 0;
		$cycle_vars[$name]['values'] = $params['values'];
	}

	if($cycle_vars[$name] == (void 0))
		$cycle_vars[$name] = {index:0,values:''};

	$cycle_vars[$name]['delimiter'] = ($params['delimiter']) ? $params['delimiter'] : ',';

	if(typeof $cycle_vars[$name]['values'] == 'array')
		$cycle_array = $cycle_vars[$name]['values'];
	else
		$cycle_array = $cycle_vars[$name]['values'].split($cycle_vars[$name]['delimiter']);

	if(!$cycle_vars[$name]['index'] || $reset)
		$cycle_vars[$name]['index'] = 0;

	if($params['assign'])
	{
		$print = false;
		$smarty.assign($params['assign'], $cycle_array[$cycle_vars[$name]['index']]);
	}

	if($print)
 		$retval = $cycle_array[$cycle_vars[$name]['index']];
	else
		$retval = '';

	if($advance)
	{
		if($cycle_vars[$name]['index'] >= $cycle_array.length - 1)
			$cycle_vars[$name]['index'] = 0;
		else
			$cycle_vars[$name]['index']++;
	}

	return $retval;
}
JSmarty.Function.cycle.$cycle_vars = {};