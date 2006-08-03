function jsmarty_modifier_default(string, defaults)
{
	if(defaults == void(0)) defaults = '';
	if(string == void(0) || string == '')
		return defaults;
	else
		return string;
}