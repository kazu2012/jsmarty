function jsmarty_function_controller(params, jsmarty)
{
	var name, func;
	if(!(name = params.name)) return;
	if(typeof(Controller) == 'undefined') return;
	name = name.charAt(0).toUpperCase() + name.slice(1);
	func = Controller[name].toString();
	func = func.slice(func.indexOf('{') + 1, func.lastIndexOf('}'));
	func = func.replace(/^\r?\n|\t/gm,'');
	return "<pre>" + func + "</pre>";
};