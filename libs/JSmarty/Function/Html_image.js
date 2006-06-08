JSmarty.Function.html_image = function($params, $smarty)
{
	if(typeof $params['file'] == 'undefined') return '';

	var $img, $html;
	var $alt, $file, $href, $width, $height, $border, $basedir;

	$alt    = $params['alt']    || '';
	$file   = $params['file'];
	$href   = $params['href']   || '';
	$width  = $params['width']  || 0;
	$height = $params['height'] || 0;
	$border = $params['border'] || 0;
	$basedir= $params['basedir']|| '.';

	if(!$width || !$height)
	{
		$img = new Image();
		$img.src = $file;
		$width = $img.width;
		$height= $img.height;
	}

	$html =
		'<img src="'+ $file +'" width="'+ $width +'" height="'+
		$height +'"'+' border="'+ $border +'" alt="'+ $alt +'" />';

	if($href)
		$html = '<a href="'+ $href +'">'+ $html + '</a>';

	return $html;
}