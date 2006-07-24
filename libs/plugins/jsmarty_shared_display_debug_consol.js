jsmarty_shared_display_debug_consol = function(params, smarty)
{
	var info = smarty._smarty_debug_info[0];

	alert
	(
		"compile_time\t:"+ info['compile_time']+"\nexec_time\t:"+ info['exec_time']
	);

	return '';
};