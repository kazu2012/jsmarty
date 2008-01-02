$(function()
{
	var renderer, compiler;
	renderer = JSmarty.getInstance();
	renderer.assign('mode','index');
	renderer.assign(eval('(' + JSmarty.System.read('templates.json','templates')+')'));
	compiler = renderer.get_compiler();

	$('#header ul').tabs();

	$('#sample').fetch();
	$('#footer').fetch();
	$('#sidebar').fetch('templates.html');

	$('a', $('#sidebar')).click(function()
	{
		var hash = this.href;
		hash = hash.slice(hash.lastIndexOf('#') + 1).split(':')

		renderer.assign('mode', 'templates');
		renderer.assign('resource', hash.join('/') + '.html');
		renderer.assign('plugin', {type: hash[0], name: hash[1]});

		renderer.assign('contents', renderer.fetch(hash.join('/') + '.html'));

		$('#sample').fetch();
	});

	$('#resource').keyup(function()
	{
		var html, timeEnd, time = new Date().getTime();
		html = compiler.execute(this.value);
		timeEnd = new Date().getTime();
		$('#resource-compiled').val(html.replace(/;/g,';\n'));
		$('#resource-timestamp').html((timeEnd - time) + "ms");
	});
});
