JSmarty.Block.foreach = function($params, $content, $smarty)
{
	var $from, $item, $key, $name;
	if(!($from = $params['from'])) return '';
	var $loop = false, $html = [], $total = 0;

	$key  = $params['key']  || false;
	$item = $params['item'] || false;
	$name = $params['name'] || false;

	if($name)
	{
		for(var i in $from) $total++;

		$smarty._smarty._smarty_vars.foreach[$name] = {};
		$loop = $smarty._smarty_vars.foreach[$name];
		$loop['iteration'] = 0;
		$loop['show']  = true, $loop['last']  = false;
		$loop['first'] = true, $loop['total'] = $total;
	}

	for(var i in $from)
	{
		if($loop)
		{
			$loop['iteration']++;
			if($loop['total'] == $loop['iteration']) $loop['last'] = true;
			if($loop['first'] && ($loop['iteration'] != 1)) $loop['first'] = false;
		}

		if($key) $smarty.assign($key, i);
		$smarty.assign($item, $from[i]);
		$html.push($smarty.parser($content));
	}

	return $html.join('');
}