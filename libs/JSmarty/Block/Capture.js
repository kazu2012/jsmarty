JSmarty.Block.Capture = function($params, $content, $smarty)
{
	var $name, $assign;

	$name	= $params['name']	|| 'default';
	$assign = $params['assign'] || '';

	$smarty.$smarty.capture[$name] = $content;

	return '';
}