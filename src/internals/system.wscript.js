if(typeof(WScript) != 'undefined')
{
	JSmarty.System.outputString = function(){
		WScript.Echo(Array.prototype.join.call(argumetns,''));
	};
};

JSmarty.System.READER = 1;
JSmarty.System.WRITER = 2;
JSmarty.System.APPEND = 8;

// (0:ASCII, -1:UNICODE)
JSmarty.System.ENCODING = -1;

JSmarty.System.isWritable = true;

/**
 * create a new FileSystemObject
 * @return FileSystemObject
 */
JSmarty.System.newFileSystemObject = function(){
	return new ActiveXObject('Scripting.FileSystemObject');
};

JSmarty.System.read = function(f, d)
{
	var text, cont, file;
	var i, p = this.buildPath(f, d);
	var fso = this.newFileSystemObject();

	for(i=p.length-1;0<=i;i--)
	{
		if(fso.FileExists(p[i]))
		{
			file = fso.GetFile(p[i]);
			text = file.OpenAsTextStream(this.READER);
			cont = text.ReadAll();
			this.modified[f] = file.DateLastModified;
			text.Close();
			break;
		};
	};

	// fso release
	fso = text = file = null;

	return cont || function()
	{
		JSmarty.Error.log('System', 'can\'t load the ' + f);
		return null;
	}();
};

JSmarty.System.write = function(p, c)
{
	var text, file;
	var fso = this.newFileSystemObject();

	file = fso.GetFile(p);
	text = file.OpenAsTextStream(this.WRITER);
	text.Write(c);
	text.Close();

	// fso release
	fso = text = file = null;
};
