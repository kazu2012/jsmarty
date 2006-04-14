JSmarty.Function.Cycle = function($params, $smarty)
{
	var $name, $print, $advance, $reset, $retval, $cycle_array;

	$name	 = ($params.name)	 ? $params.name    : 'default';
	$print	 = ($params.print)	 ? $params.print   : true;
	$reset	 = ($params.reset)	 ? $params.reset   : false;
	$advance = ($params.advance) ? $params.advance : true;

	if(typeof $cycle_vars == 'undefined')
		$cycle_vars = {};
	if(typeof $cycle_vars[$name] == 'undefined')
		$cycle_vars[$name] = {index:0,values:''};

	$cycle_array = $params.value.split(',');

	if(print)
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