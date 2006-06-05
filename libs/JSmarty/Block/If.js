JSmarty.Block.If = function($params, $content, $smarty)
{
	var $isp, $iep, $ibp, $res, $exp, $flag = false, $count = 0;
	var $L = $smarty.left_delimiter, $R = $smarty.right_delimiter;

	$exp = eval($params.replace(/(\$.*)/g, '$smarty._tpl_vars.$1'));

	mainloop:
	for(var i=0;i<$content.lastIndexOf($R);i=$iep+$R.length)
	{
		$isp = $content.indexOf($L, i);
		$iep = $content.indexOf($R, i);
		$res = $content.slice($isp + $L.length, $iep);

		switch($res.slice(0, 4))
		{
			case 'elsi':
				if($exp) break mainloop;
				$exp = eval($res.slice(5).replace(/(\$.*)/g, '$smarty._tpl_vars.$1'));
				break;
			case 'else':
				if($exp) break mainloop;
				$isp = $content.length;
				break;
			default:
				if('if' == $res.slice(0,2))
					$ibp = i, $flag = true;
				break;
		}
	}

	return $content.slice(i, $isp);
}