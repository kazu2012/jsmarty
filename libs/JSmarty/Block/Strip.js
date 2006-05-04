JSmarty.Block.Strip = function($params, $content, $smarty)
{
	return $content.replace(/\r?\n|\s/g,'');
}