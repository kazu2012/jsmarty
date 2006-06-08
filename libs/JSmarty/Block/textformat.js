JSmarty.Block.textformat = function($params, $content, $smarty)
{
	var $retval, $style, $assign;
	var $wrap, $wrap_char, $wrap_cut;
	var $indent, $indent_first, $indent_char;

	$indent = $params['indent'] || 0;
	$indent_char = $params['indent_char'] || ' ';
	$indent_first = $params['indent_first'] || 0;

	$wrap = $params['wrap'] || 80;

	return '';
}