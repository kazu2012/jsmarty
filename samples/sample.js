$(function()
{
	var renderer, compiler;

	renderer = $.getRenderer();
	renderer.assign('mode','index');
	compiler = renderer.get_compiler();

	function showHtml(hash)
	{
		var fetch = JSmarty.Plugin.get('function.fetch', JSmarty.Plugin.repos);
		var resource = fetch({file:hash.join('/') + '.html'}, renderer);

		(Models.getModelByName(hash.join(':')) || JSmarty.$function)();

		renderer.assign('mode', 'templates');
		renderer.assign('resource', resource);
		renderer.assign('plugin', {type: hash[0], name: hash[1]});

		renderer.assign('contents', renderer.fetch(hash.join('/') + '.html'));

		$('#sample').fetch();
		$('#resource').val(resource);
		$('#resource-compiled').val(compiler.execute(resource).replace(/;/g,';\n'));
	};

	$('#header ul').tabs();
	$('#sample').fetch();
	$('#footer').fetch();

	// -- sidebar
	renderer.assign(eval('(' + JSmarty.System.read('templates.json','templates')+')'));
	renderer.$vars.func = renderer.$vars['function'];
	$('#sidebar').fetch('templates.html').accordion({event:'click',header:'h3'});
	renderer.clear_all_assign();

	$('a', $('#sidebar')).click(function()
	{
		var hash = this.href;
		showHtml(hash.slice(hash.indexOf('#') + 1).split(':'));
	});

	$('#resource').keyup(function()
	{
		var html, timeEnd, time = new Date().getTime();
		html = compiler.execute(this.value);
		timeEnd = new Date().getTime();
		$('#resource-compiled').val(html.replace(/;/g,';\n'));
		$('#resource-timestamp').html((timeEnd - time) + "ms");
	});

	switch(true)
	{
		case (String(location.href).indexOf('index.html') == -1):
			location.replace(location.href + 'index.html');
			return;
		case (!!location.hash):
			var hash = location.hash;
			showHtml(hash.slice(hash.indexOf('#') + 1).split(':'));
			break;
	};
});
