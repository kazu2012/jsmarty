JSmarty.Block.If = function(params, content, JSmarty)
{
	//�������ł� {elseif}��{else}�ɖ��Ή�
	expression = params.replace(/(\$[\w.]+)/g, 'JSmarty._tpl_vars.$1');

	if(eval(expression)) return content;
	else return '';
}