jsmarty_resource_file = [];
jsmarty_resource_file.http = null;
jsmarty_resource_file[0] = function(name, rtpl, smarty)
{
	var self = jsmarty_resource_file;
	var http = (self.http) ? self.http : JSmarty.exec('xmlhttp')();

	if(!self.http) self.http = http;

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
		rtpl[name] = http.responseText;

		return true;
	}

	return false;
};
jsmarty_resource_file[1] = function(name, time, smarty)
{
	if(JSmarty.template[name])
	{
		var self = jsmarty_resource_file;
		var http = self.http;

		time[name] = http.getResponseHeader('Last-Modified');
		http.abort();

		return true;
	}

	return false;
};
jsmarty_resource_file[2] = function(){
	return true;
};
jsmarty_resource_file[3] = function(){
	return true;
};