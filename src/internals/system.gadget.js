(function()
{
	var def = JSmarty.prototype;
	var p = String(System.Gadget.path + '\\').replace(/\\/g, '/');

	def.compile_dir = p + 'templates_c';
	def.plugins_dir = [p + 'plugins'];
	def.template_dir = p + 'templates';

	JSmarty.System.path = p + JSmarty.System.path;
})();

JSmarty.System.newFileSystemObject = function(){
	return new ActiveXObject('Scripting.FileSystemObject');
};