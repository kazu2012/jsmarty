jsmarty_modifier_strip_tags = function($string, $replace_with_space)
{
	if($replace_with_space == void(0))
		$replace_with_space = true;

	if($replace_with_space)
		return $string.replace(/<[^>]*?>/,' ');
	else
		return $string.replace(/<[^>]*?>/,'');
}