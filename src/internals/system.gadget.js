(function(def)
{
	var p = JSmarty.System.path;

	def.compile_dir = p + 'templates_c';
	def.plugins_dir = [p + 'plugins'].concat(JSmarty.Plugin.repos);
	def.template_dir = p + 'templates';

})(JSmarty.prototype);

JSmarty.System.newFileSystemObject = function(){
	return new ActiveXObject('Scripting.FileSystemObject');
};