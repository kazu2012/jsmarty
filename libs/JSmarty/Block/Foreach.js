JSmarty.Block.Foreach = function($params, $content, $smarty)
{
	var $retval = '';
	var $from, $item, $key, $name;

	$key  = $params['key']  || false;
	$item = $params['item'] || false;

//	for(var i=0;i<$content;i++) $content[i] = $content[i];

	if(!$params['from']) return '';

	$from = $smarty._tpl_vars[$params['from']];

	for(var i in $from)
	{
		if($key) $smarty.assign($key, i);

		$smarty.assign($item, $from[i]);
		$retval += $smarty.parser($content);
	}

	return $retval;
}