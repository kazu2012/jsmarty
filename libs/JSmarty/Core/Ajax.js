JSmarty.Core.Ajax = function(){};
JSmarty.Core.Ajax.prototype =
{
	xmlhttp: false
}
JSmarty.Core.Ajax.prototype.create = function()
{
	if(this.xmlhttp == null) return null;

	var msxmls = [
		'Msxml2.XMLHTTP.5.0',
		'Msxml2.XMLHTTP.4.0',
		'Msxml2.XMLHTTP.3.0',
		'Msxml2.XMLHTTP',
		'Microsoft.XMLHTTP'
	]

	try
	{
		return new XMLHttpRequest();
	}
	catch(e)
	{
		for(var i=0; i<msxmls[i].length; ++i)
		{
			try
			{
				return new ActiveXObject(msxmls[i]);
			}
			catch(e){}
		}
	}
	return null;
}
JSmarty.Core.Ajax.prototype.request = function(url, options)
{
	var request = this.xmlhttp = this.create();
	var cashe, async, method, onrequest, oncomplete;

	options= options || {};
	cashe  = options.cashe || '';
	async  = (typeof options.async == 'undefined') ? true : options.async;
	method = options.method|| 'GET';
	onrequest  = options.onrequest	|| function(){};
	oncomplete = options.oncomplete || function(){};

	request.open( method, url, async);
	if(async)
	{
		onrequest(request);

		if(request.onload)
		{
			request.onload = function(){ oncomplete(request) };
		}
		else
		{
			request.onreadystatechange = function()
			{
				switch(request.readyState)
				{
					case 4:
						oncomplete(request);
						break;
				}
			}
		}
	}
	request.send('');
}
JSmarty.Core.Ajax.prototype.getText = function()
{
	return this.xmlhttp.responseText;
}