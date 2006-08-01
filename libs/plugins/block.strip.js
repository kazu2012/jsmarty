jsmarty_block_strip = function(params, content, smarty)
{
	return content.replace(/\r?\n|\s/g,'');
}