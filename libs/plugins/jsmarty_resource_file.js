if(typeof jsmarty_shared_xmlhttp == 'undefined')
	JSAN.require('jsmarty_shared_xmlhttp');

jsmarty_resource_file = {_modf:''};
jsmarty_resource_file.source = function(name, rtpl, smarty)
{
	var self, http, slsh = '/';

	self = jsmarty_resource_file;
	http = jsmarty_shared_xmlhttp.create();

	try
	{
		switch(name.indexOf(slsh))
		{
			default:
				http.open('GET', name, false);
				break;
			case -1:
				http.open('GET', smarty.template_dir + slsh + name, false);
				break;
		}

		http.send('');
		rtpl[name] = http.responseText;
		self._modf = http.getResponseHeader('Last-Modified');
		http.abort();

		return true;
	}
	catch(e){}

	return false;
};
jsmarty_resource_file.timestamp = function(name, time, smarty)
{
	if(JSmarty.template[name])
	{
		var self = jsmarty_resource_file;
		time[name] = self._modf;
		return true;
	}

	return false;
};
jsmarty_resource_file.secure = function(){
	return true;
};
jsmarty_resource_file.trusted = function(){
	return true;
};