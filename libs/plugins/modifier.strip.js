function jsmarty_modifier_strip(string, replace)
{
	if(replace == void(0)) replace = ' ';
	return string.replace(/\s+/, replace);
}