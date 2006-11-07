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
	If : function()
	{
		smarty.assign("hoge", 2);
		smarty.display('if01.txt');
		smarty.clear_assign();
		return false;
	},
	Strip : function()
	{
		smarty.display('strip01.txt');
		smarty.clear_assign();
		return false;
	},
	Foreach : function()
	{
		smarty.assign_by_ref("hoge", { English:"Hello,World", Japanese:"KONNNICHIWA,SEKAI!!" });
		smarty.display('foreach01.txt');
		smarty.clear_assign();
		return false;
	},
	Section : function()
	{
		smarty.assign("custid", [ "001", "002", "003" ]);
		smarty.assign("name",   [ "id", "shogo", "4405"]);
		smarty.assign("address",[ "hoge@com", "foo@com", "bar@com" ]);
		smarty.display('section01.txt');
		smarty.clear_assign();
		return false;
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
	},
	Html_image : function()
	{
		smarty.assign("img","images/jsmarty_icon.gif");
		smarty.display('html_image01.txt');
		smarty.clear_assign();
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
	Html_options : function()
	{
		smarty.assign("data", {"001":"tanaka","002":"suzuki","003":"kato"});
		smarty.display('html01.txt');
		smarty.clear_assign();
		return false;
	},
	Html_radios : function(){
		return Controller.Html_options();
	},
	Html_checkboxes : function(){
		return Controller.Html_options();
	}
};