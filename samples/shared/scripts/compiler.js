compiler = new JSmarty.Compiler
({
	left_delimiter:'{',
	right_delimiter:'}',
	plugins_dir : ['../lib/plugins','plugins']
});

window.onload = function()
{
	var idResult = document.getElementById('result');
	var idResource = document.getElementById('resource');

	idResource.onkeyup = function()
	{
		var s = new Date();
		var result = compiler.execute(this.value);
		var e = new Date();
		idResult.value = result + (e.getTime() - s.getTime());
	};
};