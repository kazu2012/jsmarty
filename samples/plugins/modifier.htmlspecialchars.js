function jsmarty_modifier_htmlspecialchars(s){
	return JSmarty.Plugin.get('php.htmlspecialchars')(s.toString());
};