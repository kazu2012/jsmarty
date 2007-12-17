/**
 * JSmarty plugin
 * @package JSmarty
 * @subpackage plugins
 */
function jsmarty_modifier_escape(s, t)
{
	var P = JSmarty.Plugin;

	switch(t)
	{
		case 'html':
			return P.get('php.htmlspecialchars')(s, 'ENT_QUOTES');
		case 'htmlall':
			return P.get('php.htmlentities')(s, 'ENT_QUOTES');
		case 'url':
			return escape(s);
		case 'urlpathinfo':
			return escape(s).replace(/%2F/g, '/');
//		case 'quotes':
//			return s.replace(/%(?<!\\\\)'%/g, "\\'");
		case 'hex':
			return null;
		case 'javascript':
			return P.get('php.strtr')(s, {"\\'":'\\\\', "'":"\\'", "\r":"\\r", "\n":'\\n', '</':'<\/'});
		case 'mail':
			return s.replace(/@/g, ' [AT] ').replace(/\./g, ' [DOT] ');
		default:
			return s;
	};
};
