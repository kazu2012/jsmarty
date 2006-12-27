(function(def)
{
	def.prop = { name : 'ajaja', code : 20, auth : 'shogo'};
	def.fgets = function(file, dir)
	{
		var i, f, t;
		dir = JSmarty.Utility.flatten(dir);
		for(i=0,f=dir.length;i<f;i++)
		{
			if(t) break;
			try{ t = System.readFile(dir[i] + '/' + file) }
			catch(e){ /* empty */ };
		};
		return t || '';
	};
	def.mtime = function()
	{
		
	};
	def.print = function(str){
		print(str);
	};
	def.getSelfPath = function(){ return '.'; };
})(JSmarty.System);