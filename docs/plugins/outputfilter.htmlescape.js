function jsmarty_outputfilter_htmlescape(source, jsmarty)
{
	var htmlspecialchars = JSmarty.Plugin.getFunction('php.htmlspecialchars');
	return htmlspecialchars(source, 'ENT_QUOTES');
};