(function()
{
	var script = JSmarty.Browser.getCurrentScript();
	var item = JSmarty.Classes.Item('script:' + script.id);

	JSmarty.Templatec.newTemplate(item, window[name].getCompiler());
})();