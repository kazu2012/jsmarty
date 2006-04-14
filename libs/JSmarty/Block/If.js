JSmarty.Block.If = function(params, content, JSmarty)
{
	//‰¼ŽÀ‘•‚Å‚· {elseif}‚â{else}‚É–¢‘Î‰ž
	expression = params.replace(/(\$[\w.]+)/g, 'JSmarty._tpl_vars.$1');

	if(eval(expression)) return content;
	else return '';
}