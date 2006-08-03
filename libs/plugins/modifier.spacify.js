function jsmarty_modifier_spacify(string, spacify_char)
{
	if(spacify_char == void(0)) spacify_char = ' ';
	return string.split(/.{0}/).join(spacify_char);
}