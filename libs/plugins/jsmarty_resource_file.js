jsmarty_resource_file =
{
	source:function(name, template, smarty)
	{
		var http;

		http = jsmarty_resource_file._create();
		http.open('GET', smarty.template_dir +'/'+ name, false);
		http.send('');
		template[name] = http.responseText;

		return true;
	},
	timestamp:function(){},
	secure:function(){ return true; },
	trusted:function(){}
};

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