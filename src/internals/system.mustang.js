(function(def)
{
	var File = java.io.File;
	var StringBuilder = java.lang.StringBuilder;
	var BufferedReader = java.io.BufferedReader;
	var FileInputStream = java.io.FileInputStream;
	var InputStreamReader = java.io.InputStreamReader;

	def.prop = { name : 'mustang', code : 30, auth : 'shogo' };

	def.fgets = function(file, dir)
	{
		var i, f, txt, buf;
		dir = JSmarty.Utility.flatten(dir);

		for(i=0,f=dir.length;i<f;i++)
		{
			if(!(new File(dir[i] + '/' + file).exists())) continue;
			try
			{
				txt = new StringBuilder();
				buf = new BufferedReader(
						new InputStreamReader(
							new FileInputStream(dir[i] +'/'+ file)
						)
					  );
				while(buf.ready()) txt.append(buf.readLine());
				buf.close();
			}
			catch(e){};
		};

		return txt.toString();
	};

	def.mtime = function()
	{
		
	};

	def.print = function(s){ print(s); };
	def.getSelfPath = function(){ return '.'; };

})(JSmarty.System);