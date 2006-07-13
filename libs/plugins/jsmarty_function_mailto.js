jsmarty_function_mailto = function($params, $smarty)
{
	var $args, $text, $html, $extra, $encode;

	$address= $params['address'];

	$args   = ['cc','bcc','subject'];
	$text   = $params['text'] || $params['address'];
	$extra  = ($params['extra']) ? ' '+$params['extra'] : '';
	$encode = $params['encode'] || 'none';

	$html = 
		'<a href="mailto:'+ $address +'"'+ $extra +'>'+ $text +'</a>';

	return $html;
}