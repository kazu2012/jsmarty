JSmarty.Modifier.Strip = function($string, $replace)
{
	if($replace == (void 0)) $replace = ' ';
	return $string.replace(/\s+/, $replace);
}