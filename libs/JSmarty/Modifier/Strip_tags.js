JSmarty.Modifier.Strip_tags = function($string, $replace_with_space)
{
	if(typeof $replace_with_space == 'undefined')
		 $replace_with_space = true;

	if($replace_with_space)
		return $string.replace(/<[^>]*?>/,' ');
	else
		return $string.replace(/<[^>]*?>/,'');
}