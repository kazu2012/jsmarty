jsmarty_block_textformat = function($params, $content, $smarty)
{
	var $text, $wraps, $indents, $style, $assign

	$indents =
	{
		char: $params['indent_char'] || ' ',
		first: $params['indent_first'] || 0,
		indent: $params['indent'] || 0,
	}

	$wraps =
	{
		wrap: $params['wrap'],
		cut : $params['wrap_cut'],
		char: $params['wrap_char']
	}

	$wrap = $params['wrap'] || 80;

	return '';
}