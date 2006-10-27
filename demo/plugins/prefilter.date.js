function jsmarty_prefilter_date(source, jsmarty)
{
	return new Date().toString() + source;
};