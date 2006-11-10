function jsmarty_function_model(params, jsmarty)
{
	var name, func;
	if(!(name = params.name)) return;
	if(typeof(Model) == 'undefined') return;
	name = name.charAt(0).toUpperCase() + name.slice(1);
	func = Model[name].toString();
	func = func.slice(func.indexOf('{') + 1, func.lastIndexOf('}'));
	func = func.replace(/^\r?\n|^\t*/gm,'');
	return "<pre>" + func + "</pre>";
};