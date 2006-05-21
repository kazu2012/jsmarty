JSmarty.Shared.Ajax = function(){};
JSmarty.Shared.Ajax.prototype =
{
	onLine : (document.URL.indexOf('http')==0) ? true : false
}
JSmarty.Shared.Ajax.prototype.create = function()
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
JSmarty.Shared.Ajax.prototype.display = function(url, element, smarty)
{
	var xmlhttp = this.create();

	xmlhttp.open('GET', url, true);
	if(typeof xmlhttp.onload != 'undefined')
		xmlhttp.onload = this._handler(xmlhttp, element, smarty);
	else
		xmlhttp.onreadystatechange = this._handler(xmlhttp, element, smarty);
	xmlhttp.send('');
}
JSmarty.Shared.Ajax.prototype.file_get_contents = function(filename)
{
	var xmlhttp = this.create();

	xmlhttp.open('GET', filename, false);
	xmlhttp.send('');

	return xmlhttp.responseText;
}
JSmarty.Shared.Ajax.prototype.file_exists = function(filename)
{
	return true;
}
JSmarty.Shared.Ajax.prototype._handler = function(xmlhttp, element, smarty)
{
	return function()
	{
		if(xmlhttp.readyState != 4) return;
		element.innerHTML = smarty.parser(xmlhttp.responseText, true);
		xmlhttp = null;
	}
}