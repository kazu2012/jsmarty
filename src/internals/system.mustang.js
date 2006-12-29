(function(def)
{
	def.prop = { name : 'mustang', code : 30, auth : 'shogo' };

	def.fgets = function(file, dir)
	{
		var i, f, n = -1, s = [];
		var buf, BufferedReader = java.io.BufferedReader;
		var fis, FileInputStream = java.io.FileInputStream;
		var isr, InputStreamReader = java.io.InputStreamReader;

		dir = JSmarty.Utility.flatten(dir);
		for(i=0,f=dir.length;i<f;i++)
		{
			if(0 <= n) break;
			try
			{
				fis = new FileInputStream(dir[i] +'/'+ file);
				isr = new InputStreamReader(fis);
				buf = new BufferedReader(isr);

				while(buf.ready())
				{
					s[++n] = buf.readLine();
				};

				buf.close();
				isr.close();
				fis.close();
			}
			catch(e){};
		};
		return (0 <= n) ? s.join('') : '';
	};

	def.mtime = function()
	{
		
	};

	def.print = function(s){ print(s); };
	def.getSelfPath = function(){ return '.'; };

})(JSmarty.System);