(function(def)
{
	def.prop = { name : 'mustang', code : 30, auth : 'shogo' };

	def.fgets = function(file, dir)
	{
		var txt, StringBuilder = java.lang.StringBuilder;
		var buf, BufferedReader = java.io.BufferedReader;
		var fis, FileInputStream = java.io.FileInputStream;
		var isr, InputStreamReader = java.io.InputStreamReader;

		dir = JSmarty.Utility.flatten(dir);
		for(var i=0,f=dir.length;i<f;i++)
		{
			if(0 < txt.length()) break;
			try
			{
				fis = new FileInputStream(dir[i] +'/'+ file);
				isr = new InputStreamReader(fis);
				buf = new BufferedReader(isr);
				txt = new StringBuilder();

				while(buf.ready()) txt.append(buf.readLine());

				buf.close();
				isr.close();
				fis.close();
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