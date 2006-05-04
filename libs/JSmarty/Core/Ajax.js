JSmarty.Core.Ajax = function(){};
JSmarty.Core.Ajax.prototype =
{
	onLine : (document.URL.indexOf('http')==0) ? true : false
}
JSmarty.Core.Ajax.prototype.create = function()
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
		for(var i=0; i<msxmls[i].length; ++i)
		{
			try{
				return new ActiveXObject(msxmls[i]);
			}
			catch(e){}
		}
	}
	return null;
}
JSmarty.Core.Ajax.prototype.request = function(url, options)
{
	var xmlhttp = this.create();
	var cashe, async, method, oncomplete;

	options= options || {};
	cashe  = options.cashe || '';
	async  = (typeof options.async == 'undefined') ? true : options.async;
	method = options.method|| 'GET';
	onrequest  = options.onrequest	|| function(){};
	oncomplete = options.oncomplete || function(){};

	xmlhttp.open(method, url, async);
	if(async)
	{
		if(typeof xmlhttp.onload != 'undefined')
			xmlhttp.onload = oncomplete(xmlhttp);
		else
			xmlhttp.onreadystatechange = oncomplete(xmlhttp);
	}
	xmlhttp.send('');
}
JSmarty.Core.Ajax.prototype.getText = function()
{
	return this.xmlhttp.responseText;
}