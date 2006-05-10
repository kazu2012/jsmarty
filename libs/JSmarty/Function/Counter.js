JSmarty.Function.Counter = function($params, $smarty)
{
	var $counters = JSmarty.Function.Counter.$counters;
	var $retval, $name, $counter;

	$name = ($params['name']) ? $params['name'] : 'default';

	if(typeof $counters[$name] == 'undefined')
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
		$counter['start'] = $counter['count'] = $params['start'];

	if($params['assign'] != '')
		$counter['assign'] = $params['assign'];

	if($params['assign'])
		$counter['assign'] = $params['assign'];

	if($counter['assign'])
		$smarty.assign($counter['assign'], $counter['count']);

	if($params['print'])
		$print = new Boolean($params['print']);
	else
		$print = (!$counter['assign'] || $counter['assign'] == 0) ? false : true; // ‹““®‰ö‚µ‚¢‚©‚àc

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
JSmarty.Function.Counter.$counters = {};