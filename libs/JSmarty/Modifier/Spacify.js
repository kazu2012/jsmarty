JSmarty.Modifier.Spacify = function($string, $spacify_char)
{
	if($spacify_char == (void 0)) $spacify_char = ' ';
	return $string.split(/./).join($spacify_char);
}