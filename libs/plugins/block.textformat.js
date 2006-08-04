function jsmarty_block_textformat(params, content, smarty)
{
	if(!(content = content.call(smarty))) return '';

	var style        = params.style || null;
	var indent       = (params.indent || 0) - 0;
	var indent_first = (params.indent_first || 0) - 0;
	var indent_char  = params.indent_char || ' ';
	var wrap         = (params.wrap || 80) - 0;
	var wrap_char    = params.wrap_char || '\n';
	var wrap_cut     = params.wrap_cut || false;
	var assign       = params.assign || null;

	if(style == 'email')
		wrap = 72;
}