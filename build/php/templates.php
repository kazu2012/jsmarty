<?php

main();

function main()
{
	$order = array();
	$parents = glob('../samples/templates/*', GLOB_ONLYDIR);

	foreach($parents as $parent)
	{
		$type = slidir($parent);
		$temp = glob("$parent/*");
		$temp = array_map("slidir", $temp);
		$order[$type] = array_map("remext", $temp);
	}

	file_put_contents(
		"../samples/templates/templates.json",
		json_encode($order)
	);
}

function slidir($dir){
	return substr($dir, strrpos($dir, "/") + 1);
}

function remext($filename){
	return substr($filename, 0, strpos($filename, "."));
}