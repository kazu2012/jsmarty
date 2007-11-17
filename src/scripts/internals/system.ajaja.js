JSmarty.System.read = function(f, d)
{
	var i, c, p = this.buildPath(f, d);
	for(i=p.length-1;0<=i;i--)
	{
		try
		{
			c = System.readFile(p[i]);
			this.modified[f] = new Date().getTime();
			break;
		}
		catch(e){};
	};

	return c || function()
	{
		JSmarty.Error.log('System', 'can\'t load the ' + f);
		return null;
	}();
};

JSmarty.System.outputString = function(){
	print(Array.prototype.join.call(arguments,''));
};
