jsmarty_shared_xmlhttp = {};
jsmarty_shared_xmlhttp.create = function()
{
	var msxmls = [
		'Msxml2.XMLHTTP.5.0',
		'Msxml2.XMLHTTP.4.0',
		'Msxml2.XMLHTTP.3.0',
		'Msxml2.XMLHTTP',
		'Microsoft.XMLHTTP'
	];

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