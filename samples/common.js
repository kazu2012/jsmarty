
$(function()
{
	var renderer, compiler;
	renderer = (new JSmarty()).assign('mode','index');
	compiler = renderer.getCompiler();

	$('#header ul').tabs();

	$('#sample-container').html(renderer.fetch('id:sample-container'));
	$('#footer').html(renderer.fetch('id:footer'));

	$('#resource').keyup(function()
	{
		var html, timeEnd, time = new Date().getTime();
		html = compiler.execute(this.value);
		timeEnd = new Date().getTime();
		$('#resource-compiled').val(html.replace(/;/g,';\n'));
		$('#resource-timestamp').html((timeEnd - time) + "ms");
	});
});