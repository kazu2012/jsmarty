function smarty_function_html_image(params, smarty)
{
	if(params.file)
	{
		smarty.trigger_error("html_image: missing 'file' parameter");
		return '';
	}

	var img, html, attr = [];

	for(var i in params)
	{
		switch(params[i])
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