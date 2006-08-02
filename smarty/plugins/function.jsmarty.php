<?php

function smarty_function_jsmarty($params, &$smarty)
{
	$include  = $params['include'];
	$instance = $params['instance'];

	$script = <<<__EOT__
	<script type="text/javascript" charset="UTF-8" src="{$include}/JSmarty.js"></script>
	<script type="text/javascript" charset="UTF-8" src="{$include}/JSmarty_Compiler.js"></script>
	<script type="text/javascript">
	var {$instance} = new JSmarty;
	{$instance}.plugins_dir = ['$include/plugins'];
	</script>
__EOT__;

	return $script;
}
?>