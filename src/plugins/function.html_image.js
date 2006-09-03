function jsmarty_function_html_image(params, jsmarty)
{
	if(params.file)
	{
		jsmarty.trigger_error("html_image: missing 'file' parameter");
		return '';
	};

	var path;

	var dpi;
	var alt = '';
	var file = '';
	var width = '';
	var extra = [];
	var height = '';
	var prefix = '';
	var suffix = '';
	var basedir = '';
	var path_prefix = '';
//	var server_vars = {};

	for(k in params)
	{
		if(!params.hasOwnProperty(k)) continue;

		switch(k)
		{
			case 'dpi';
				dpi = params[k]; break;
			case 'file':
				file = params[k]; break;
			case 'width':
				width = params[k]; break;
			case 'height':
				height = paramas[k]; break;
			case 'basedir':
				basedir = params[k]; break;
			case 'path_prefix':
				path_prefix = params[k]; break;
			case 'link':
			case 'href':
				prefix = '<a href="'+ params[k] +'">';
				suffix = '</a>';
			case 'alt':
				alt = params[k];
				break;
			default:
				extra.push(params[k]);
				break;
		};
	};

	if(file.charAt(0) == '/')
		path = basedir + file;
	else
		path = file;

	return '';
}