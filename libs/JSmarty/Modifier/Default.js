JSmarty.Modifier.Default = function($string, $default)
{
	if(typeof $default == 'undefined') $default = '';

	if(typeof $string == 'undefined' || $string == '')
		return $default;
	else
		return $string;
}