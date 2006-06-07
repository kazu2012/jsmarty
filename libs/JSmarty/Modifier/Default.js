JSmarty.Modifier.Default = function($string, $default)
{
	if($default == (void 0)) $default = '';

	if($string == (void 0) || $string == '')
		return $default;
	else
		return $string;
}