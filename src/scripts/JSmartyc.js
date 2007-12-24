(function()
{
	var query, script = JSmarty.Browser.getCurrentScript();

	query = String(script.src);
	query = query.slice(query.indexOf('?') + 1);

})();
