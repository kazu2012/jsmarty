
function jsmarty_modifier_escape(string, esc_type, char_set = 'ISO-8859-1')
{
	switch(esc_type)
	{
		case 'mail':
			return string.replace(['@',/\./],[' [AT] ',' [DOT] ']);
	};
};