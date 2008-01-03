var Models =
{
	getModelByName : function(name){
		return this[name] || null;
	},
	'builtin:if' : function()
	{
		var jsmarty = $.getRenderer();
		jsmarty.assign('hoge', 2);
	},
	'builtin:section' : function()
	{
		var jsmarty = $.getRenderer();
		jsmarty.assign('custid', [ '001', '002', '003', '004', '005' ]);
		jsmarty.assign('name',   [ 'hoge', 'foo', 'bar', 'foofoo', 'barbar']);
		jsmarty.assign('address',[ 'hoge@com', 'foo@com', 'bar@com', 'foofoo@com', 'barbar@com']);
	},
	'builtin:foreach' : function()
	{
		var jsmarty = $.getRenderer();
		jsmarty.assign('hoge', {English:"Hello,World", Japanese:"KONNNICHIWA,SEKAI!!"});
	},
	'function:html_table' : function()
	{
		var jsmarty = $.getRenderer();
		jsmarty.assign('data', [0,1,2,3,4,5,6,7,8]);
		jsmarty.assign('tr', ['bgcolor="#eeeeee"','bgcolor="#dddddd"']);
	}
};
