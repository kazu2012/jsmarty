/**
 * Construct a new JSmarty.File
 * @class This is plugin class.
 * @constructor
 */
JSmarty.Plugin = function(){};
JSmarty.Plugin.prototype = new JSmarty.File();
/**
 * Evalute the source of plugin.
 * @param  {String} code - The source code of javascript.
 * @param  {String} name - Plugin-name.
 * @param  {String} type - Plugin-type.
 * @return {Boolean} Evalute done, or not.
 */
JSmarty.Plugin.prototype.parse = function(code, name, type)
{
	var __parent, __script = null;

	__parent = (type == 'shared') ?
		JSmarty.shared :
		JSmarty.prototype._plugins[type];

	if(code)
	{
		try
		{
			eval(code);
			__script = eval(['jsmarty', type, name].join('_'));
		}
		catch(e){ /* empty */ };
	};

	__parent[name] = __script;
	return (__script) ? true : false;
};
/**
 * Load plugin.
 * @param {String} name Plugin-name.
 * @param {String} type Plugin-type.
 * @param {String} path The repository path of plugins. 
 * @type Boolean
 */
JSmarty.Plugin.prototype.addPlugin = function(name, type, path)
{
	var i, code;
	var script = [type, name, 'js'].join('.');

	for(i=path.length-1;i>=0;i--)
	{
		code = this.fgets(path[i] + '/' + script);
		if(code) break;
	};

	return this.parse(code, name, type);
};
/**
 * Load module.
 * @param {String} namespace
 * @param {String} filename
 * @type Boolean
 */
JSmarty.Plugin.prototype.addModule = function(filename, global)
{
	if(this.modules[filename]) return true;
};
/**
 * Load template is compiled.
 * @param {String} name
 * @type Boolean
 */
JSmarty.Plugin.prototype.addTemplatec = function(name)
{
	if(JSmarty.templates_c[name]) return true;
};