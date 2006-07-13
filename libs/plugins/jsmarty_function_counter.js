jsmarty_function_counter = function($params, $smarty)
{
	var $retval, $name, $counter;
	var $counters = jsmarty_function_counter.$counters;

	$name = $params['name'] || 'default';

	if($counters[$name] == void(0))
	{
		$counters[$name] = {
			start: 1,
			skip : 1,
			count: 1,
			direction : 'up'
			};
	}

	$counter = $counters[$name];

	if($params['start'])
		$counter['start'] = $counter['count'] = $params['start'] - 0;

	if($params['assign'] != '')
		$counter['assign'] = $params['assign'];

	if($params['assign'])
		$counter['assign'] = $params['assign'];

	if($counter['assign'])
		$smarty.assign($counter['assign'], $counter['count']);

	if($params['print'])
		$print = new Boolean($params['print']);
	else
		$print = (!$counter['assign'] || $counter['assign'] == 0) ? true : false;

	if($print)
		$retval = $counter['count'];
	else
		$retval = '';

	if($params['skip'])
		$counter['skip'] = $params['skip'];

	if($params['direction'])
		$counter['direction'] = $params['direction'];

	if($counter['direction'] == 'down')
		$counter['count'] -= $counter['skip'];
	else
		$counter['count'] += $counter['skip'];

	return $retval;
}
jsmarty_function_counter.$counters = {};