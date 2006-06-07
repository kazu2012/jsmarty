JSmarty.Block.Foreach = function($params, $content, $smarty)
{
	if(!$params['from']) return '';

	var $from, $item, $key, $name;
	var $loop = false, $retval = '', $total = 0;

	$key  = $params['key']  || false;
	$item = $params['item'] || false;
	$name = $params['name'] || false;
	$from = $params['from'];

	if($params['name'])
	{
		for(var i in $from) $total++;

		$loop = $smarty.$smarty.foreach[$params['name']];

		$loop['iteration'] = 0;
		$loop['show']  = true, $loop['last']  = false;
		$loop['first'] = true, $loop['total'] = $total;
	}

	for(var i in $from)
	{
		if($key ) $smarty.assign($key, i);
		if($loop)
		{
			$loop['iteration']++;
			if($loop['total'] == $loop['iteration']) $loop['last'] = true;
			if($loop['first'] && ($loop['iteration'] != 1)) $loop['first'] = false;
		}

		$smarty.assign($item, $from[i]);
		$retval += $smarty.parser($content);
	}

	return $retval;
}