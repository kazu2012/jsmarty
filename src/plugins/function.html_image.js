function jsmarty_function_html_image(params, jsmarty)
{
	if(params.file)
	{
		jsmarty.trigger_error("html_image: missing 'file' parameter");
		return '';
	}

	var img, html, attr = [];

	for(var i in params)
	{
		switch(i)
		{
			case 'dpi':
			case 'file':
			case 'width':
			case 'height':
			case 'basedir':
			case 'path_prefix':
				break;
			default:
				attr.push(i +'="'+ params[i] +'"');
				break;
		}
	}

	return html;
}