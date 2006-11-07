window.onload = function()
{
	var i, f, link, links = document.getElementsByTagName('a');
	for(i=0,f=links.length;i<f;i++)
	{
		link = links[i];
		if((hash = link.href.indexOf('#')) > -1)
		{
			hash = link.href.slice(hash + 1);
			link.onclick = Controller.HashRecord(hash);
			link.onkeypress = Controller.HashRecord(hash);
		}
	};
};

var Controller =
{
	HashRecord : function(arg)
	{
		arg = arg.charAt(0).toUpperCase() + arg.slice(1);
		if(this[arg]) return this[arg];
		return function(){ return false; };
	},
	Mailto : function()
	{
		smarty.display('mailto01.txt');
		return false;
	},
	Counter : function()
	{
		smarty.display('counter01.txt');
		return false;
	},
	Cycle : function()
	{
		smarty.display('cycle01.txt');
		return false;
	},
	Html_table : function()
	{
		smarty.assign_by_ref('data', [0,1,2,3,4,5,6,7,8]);
		smarty.assign_by_ref('tr', ['bgcolor="#eeeeee"','bgcolor="#dddddd"']);
		smarty.display('html_table01.txt');
		smarty.clear_assign();
		return false;
	},
	Ldelim : function()
	{
		smarty.display('ldelim01.txt');
		return false;
	},
	Rdelim : function()
	{
		smarty.display('rdelim01.txt');
		return false;
	},
	Literal : function()
	{
		smarty.display('literal01.txt');
		return false;
	}
};