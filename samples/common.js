$(function()
{
	var renderer, compiler;

	renderer = $.getRenderer();
	renderer.assign('mode','index');
	renderer.assign(eval('(' + JSmarty.System.read('templates.json','templates')+')'));
	compiler = renderer.get_compiler();

	$('#header ul').tabs();

	$('#sample').fetch();
	$('#footer').fetch();
	$('#sidebar').fetch('templates.html');

	$('a', $('#sidebar')).click(function()
	{
		var fetch = JSmarty.Plugin.get('function.fetch', JSmarty.Plugin.repos);
		var resource, hash = this.href;

		hash = hash.slice(hash.lastIndexOf('#') + 1).split(':')

		resource = fetch({file:hash.join('/') + '.html'}, renderer);

		renderer.assign('mode', 'templates');
		renderer.assign('resource', resource);
		renderer.assign('plugin', {type: hash[0], name: hash[1]});

		renderer.assign('contents', renderer.fetch(hash.join('/') + '.html'));

		$('#sample').fetch();
		$('#resource').val(resource);
		$('#resource-compiled').val(compiler.execute(resource).replace(/;/g,';\n'));
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
