function jsmarty_block_template(params, content, jsmarty)
{
	var s = '<h3>Result</h3>';
	var i = content.lastIndexOf(s) ;
	return content.slice(i + s.length + 2);
};