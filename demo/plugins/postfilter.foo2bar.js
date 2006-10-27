function jsmarty_postfilter_foo2bar(source, jsmarty)
{
	return source.replace(/foo/g,'bar');
};