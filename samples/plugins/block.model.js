function jsmarty_block_model(params, contents, jsmarty)
{
	if(!params.type || !params.name){ return; };

	var model, html = new JSmarty.Classes.Buffer();
	model = Models.getModelByName([params.type, params.name].join(':'));

	if(model)
	{
		model = model.toString();
		model = model.slice(model.indexOf('{') + 1, model.lastIndexOf('}'));
		model = model.replace(/^[\r\n\t\s]*/gm,'');

		html.append(contents);
		html.append('<pre>').append(model).append('</pre>');
	};

	return html.toString();
};
