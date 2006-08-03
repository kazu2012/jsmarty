/**
 * JSmarty plugin
 * @package JSmarty
 * @subpackage plugins
 */

var jsmarty_resource_file = new Array(4);
jsmarty_resource_file[0] = function(name, param, smarty)
{
	var http = new JSmarty.Connect().XMLHTTP;

	try
	{
		switch(name.indexOf('/'))
		{
			default:
				http.open('GET', name, false);
				break;
			case -1:
				http.open('GET', smarty.template_dir + '/' + name, false);
				break;
		}

		http.send('');
		param.src = http.responseText;
		param.time= http.getResponseHeader('Last-Modified');
		http.abort();
		
		http = null;
		
		return true;
	}
	catch(e){};

	return false;
};
jsmarty_resource_file[1] = function(name, param, smarty)
{
	param.time = new Date(param.time).getTime();
	return true;
};
jsmarty_resource_file[2] = function(){
	return true;
};
jsmarty_resource_file[3] = function(){
	return true;
};