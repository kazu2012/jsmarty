/**
 * JSmarty plugin
 * @package JSmarty
 * @subpackage plugins
 */

jsmarty_resource_var = [];
jsmarty_resource_var[0] = function(name, param, smarty)
{
	param.src = name;
	return true;
};
jsmarty_resource_var[1] = function(name, param, smarty)
{
	param.time = new Date().getTime();
	return true;
};
jsmarty_resource_var[2] = function(){
	return true;
};
jsmarty_resource_var[3] = function(){
};