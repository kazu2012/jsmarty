var Models =
{
	getModelByName : function(name){ return this[name] || null; },
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
	'builtin:include' : function()
	{
		var jsmarty = $.getRenderer();
		jsmarty.assign('foo','foo');
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
	},
	'function:html_image' : function()
	{
		var jsmarty = $.getRenderer();
		jsmarty.assign('img','shared/images/jsmarty_icon.gif');
	},
	'function:html_checkboxes' : function()
	{
		var jsmarty = $.getRenderer();
		jsmarty.assign('data', {'001':'tanaka', '002':'suzuki', '003':'kato'});
	},
	'function:html_options' : function()
	{
		var jsmarty = $.getRenderer();
		jsmarty.assign('data', {'001':'tanaka', '002':'suzuki', '003':'kato'});
	},
	'function:html_radios' : function()
	{
		var jsmarty = $.getRenderer();
		jsmarty.assign_by_ref('data', {'001':'tanaka', '002':'suzuki', '003':'kato'});
	},
	'modifier:capitalize' : function()
	{
		var jsmarty = $.getRenderer();
		jsmarty.assign('foo', 'this is a pen.');
	},
	'modifier:nl2br' : function()
	{
		var jsmarty = $.getRenderer();
		jsmarty.assign("html",'Hello\nWorld!!\n');
	},
	'modifier:truncate' : function()
	{
		var jsmarty = $.getRenderer();
		jsmarty.assign('text','El ingenioso hidalgo Don Quijote de La Mancha');
	},
	'modifier:wordwrap' : function()
	{
		var jsmarty = $.getRenderer();
		jsmarty.assign('text','El ingenioso hidalgo Don Quijote de La Mancha');
	},
	'modifier:cat' : function()
	{
		var jsmarty = $.getRenderer();
		jsmarty.assign('hoge', 'Hello');
	}
};
