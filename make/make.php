<?php
require 'smarty/Smarty.class.php';

$list = glob('templates/html/*.html');
$smarty = new Smarty();
$smarty->plugins_dir = array('plugins', '../smarty/plugins');
foreach($list as $html)
{
	$smarty->assign('content', substr($html, 10));
	$handle = fopen("../demo/". substr($html, 15), "w+");
	fwrite($handle, $smarty->fetch('main.html'));
	fclose($handle);
}

$list = glob('templates_c/*.php');
foreach($list as $php){
	unlink($php);
}
/*
// call main function
main();

/*
function main()
{
	$smarty = new Smarty();
	$smarty->plugins_dir = array('plugins', '../smarty/plugins');
};
*/
?>