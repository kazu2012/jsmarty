jsmarty_resource_file = {};
jsmarty_resource_file.source = function(name, temp, smarty)
{
	var http;

	http = jsmarty_resource_file._create();
	http.open('GET', smarty.template_dir + name, false);
	http.send('');
	temp[name] = http.responseText;

	return true;
};
jsmarty_resource_file.secure = function(){return true;};
jsmarty_resource_file.trusted = function(){};
jsmarty_resource_file.timestamp = function(){};
jsmarty_resource_file._create = function()
{
	var msxmls = [
		'Msxml2.XMLHTTP.5.0',
		'Msxml2.XMLHTTP.4.0',
		'Msxml2.XMLHTTP.3.0',
		'Msxml2.XMLHTTP',
		'Microsoft.XMLHTTP'
	]

	try{
		return new XMLHttpRequest();
	}
	catch(e)
	{
		for(var i=0,fin=msxmls.length;i<fin;i++)
		{
			try{
				return new ActiveXObject(msxmls[i]);
			}
			catch(e){}
		}
	}
	return null;
};