JSmarty.Modifier.strip = function($string, $replace)
{
	if($replace == void(0)) $replace = ' ';
	return $string.replace(/\s+/, $replace);
}