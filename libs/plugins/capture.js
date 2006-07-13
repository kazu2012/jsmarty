JSmarty.Block.capture = function($params, $content, $smarty)
{
	var $name, $assign;

	$name	= $params['name']	|| 'default';
	$assign = $params['assign'] || '';

	$smarty._smarty_vars.capture[$name] = $content;

	return '';
}