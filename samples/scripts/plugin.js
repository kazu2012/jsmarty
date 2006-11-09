window.onload = function()
{
	var i, f, link, links = document.getElementsByTagName('a');
	for(i=0,f=links.length;i<f;i++)
	{
		link = links[i];
		if((hash = link.href.indexOf('#')) > -1)
		{
			hash = link.href.slice(hash + 1);
			link.onclick = link.onkeypress = Record.HashRecord(hash);
		}
	};

	Record.HashRecord(String(location.hash).slice(1))();
};

var Record = {};
Record.HashRecord = function(arg)
{
	arg = arg.charAt(0).toUpperCase() + arg.slice(1);
	if(Model[arg]) return Model[arg];
	return function(){ return false; };
};

var Model =
{
	Index : function()
	{
		smarty.display('plugin.txt');
	},
	If : function()
	{
		smarty.assign("hoge", 2);
		smarty.display('if01.txt');
		smarty.clear_assign();
	},
	Textformat : function()
	{
		smarty.display('textformat01.txt');
	},
	Strip : function()
	{
		smarty.display('strip01.txt');
		smarty.clear_all_assign();
	},
	Foreach : function()
	{
		smarty.assign_by_ref("hoge", { English:"Hello,World", Japanese:"KONNNICHIWA,SEKAI!!" });
		smarty.display('foreach01.txt');
		smarty.clear_all_assign();
	},
	Section : function()
	{
		smarty.assign_by_ref("custid", [ "001", "002", "003" ]);
		smarty.assign_by_ref("name",   [ "id", "shogo", "4405"]);
		smarty.assign_by_ref("address",[ "hoge@com", "foo@com", "bar@com" ]);
		smarty.display('section01.txt');
		smarty.clear_all_assign();
	},
	Mailto : function()
	{
		smarty.display('mailto01.txt');
	},
	Counter : function()
	{
		smarty.display('counter01.txt');
	},
	Cycle : function()
	{
		smarty.display('cycle01.txt');
	},
	Ldelim : function()
	{
		smarty.display('ldelim01.txt');
	},
	Rdelim : function()
	{
		smarty.display('rdelim01.txt');
	},
	Literal : function()
	{
		smarty.display('literal01.txt');
	},
	Html_image : function()
	{
		smarty.assign("img","images/jsmarty_icon.gif");
		smarty.display('html_image01.txt');
		smarty.clear_all_assign();
	},
	Html_table : function()
	{
		smarty.assign_by_ref('data', [0,1,2,3,4,5,6,7,8]);
		smarty.assign_by_ref('tr', ['bgcolor="#eeeeee"','bgcolor="#dddddd"']);
		smarty.display('html_table01.txt');
		smarty.clear_all_assign();
	},
	Html_options : function()
	{
		smarty.assign_by_ref("data", {"001":"tanaka","002":"suzuki","003":"kato"});
		smarty.display('html01.txt');
		smarty.clear_all_assign();
	},
	Html_radios : function(){
		Controller.Html_options();
	},
	Html_chackboxes : function(){
		Controller.Html_options();
	}
};