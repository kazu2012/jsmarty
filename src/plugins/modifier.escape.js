
function jsmarty_modifier_escape(string, esc_type, char_set)
{
	switch(esc_type)
	{
		case 'mail':
			return string.replace(['@',/\./],[' [AT] ',' [DOT] ']);
	};
};