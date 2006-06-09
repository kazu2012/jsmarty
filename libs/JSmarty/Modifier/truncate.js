JSmarty.Modifier.truncate = function($string, $length, $etc, $break_words, $middle)
{
	$length = ($length) ? $length - 0 : 80;

	if($length == 0) return '';
	if($etc == void(0)) $etc = '...';
	if($middle == void(0)) $middle = false;
	if($break_words == void(0)) $break_words = false;

	if($string.length > $length)
	{
		$length -= $etc.length;
		if(!$break_words && !$middle)
			$string = $string.slice(0, $length+1).replace(/\s+?(\S+)?$/, '');
		if(!$middle)
			return $string.slice(0, $length) + $etc;
		else
			return $string.slice(0, $length/2) + $etc + $string.slice(-$length/2);
	}
	else
		return $string;
}