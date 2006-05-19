JSmarty.Modifier.Spacify = function($string, $spacify_char)
{
	if(typeof $spacify_char == 'undefined') $spacify_char = ' ';
	return $string.split(/./).join($spacify_char);
}