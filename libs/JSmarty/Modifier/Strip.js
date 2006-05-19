JSmarty.Modifier.Strip = function($string, $replace)
{
	if(typeof $replace == 'undefined') $replace = ' ';
	return $string.replace(/\s+/, $replace);
}