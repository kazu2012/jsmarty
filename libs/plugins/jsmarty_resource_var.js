/**
 * JSmarty plugin
 * @package JSmarty
 * @subpackage plugins
 */

jsmarty_resource_var = {};
jsmarty_resource_var.source = function(name, rtpl, smarty)
{
	rtpl[name] = name;
	return true;
};
jsmarty_resource_var.timestamp = function(name, time, smarty)
{
	time[name] = new Date().getTime();
	return true;
};
jsmarty_resource_secure = function(){
	return true;
};
jsmarty_resource_trusted = function(){
};