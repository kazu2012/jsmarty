JSmarty.Function.Html_table = function($params, $smarty)
{
	var tr = JSmarty.Function.Html_table.tr;

	var $attr, $html;
	var $tr_attr, $td_attr, $table_attr;
	var $loop, $cols, $hdir, $vdir, $traolpad;

	$attr = ['tr_attr','td_attr','table_attr'];

	$html = '<table'+ $table_attr +'><!--__TR__--></table>'
	return $html.replace(/<!--__TR__-->|<!--__TD__-->/,'');
}

JSmarty.Function.Html_table.tr = function()
{
	
}