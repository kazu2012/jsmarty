if(JSmarty.File.getSystem() != 'ajaja')
	JSmarty.File.__system__ = 'ajaja';

// Wrapper for print()
JSmarty.print = function(str){ print(str); };

// Return the path of '.'
JSmarty.getSelfPath = function(){ return '.'; };

// override JSmarty.File.fgets method
JSmarty.File.fgets = function(file, dir)
{
	var text;
	dir = JSmarty.flatten(dir);
	for(var i=0,f=dir.length;i<f;i++)
	{
		if(text) break;
		try
		{
			text = System.readFile(dir[i] + '/' + file);
			this.__mtimes__[file] = new Date.getTime();
		}
		catch(e){ /* empty */ }
	}
	return text || '';
};