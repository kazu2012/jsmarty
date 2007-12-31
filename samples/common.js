
$(function()
{
	var renderer, compiler;
	renderer = JSmarty.getInstance().assign('mode','index');
	compiler = renderer.get_compiler();

	$('#header ul').tabs();

	$('#sample').fetch('id:sample');
	$('#footer').fetch('id:footer');

	$('#resource').keyup(function()
	{
		var html, timeEnd, time = new Date().getTime();
		html = compiler.execute(this.value);
		timeEnd = new Date().getTime();
		$('#resource-compiled').val(html.replace(/;/g,';\n'));
		$('#resource-timestamp').html((timeEnd - time) + "ms");
	});
});