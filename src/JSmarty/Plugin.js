/**
 * Construct a new JSmarty.File
 * @class This is plugin class.
 * @constructor
 */
JSmarty.Plugin = JSmarty.Factory(JSmarty.File);

JSmarty.Plugin.Object = {
	append : function(ns, flag){ this[ns] = flag; }
};

JSmarty.Plugin.plugins = JSmarty.Factory(JSmarty.Plugin.Object);
JSmarty.Plugin.modules = JSmarty.Factory(JSmarty.Plugin.Object);

/**
 * Evalute the source of plugin.
 * @param  {String} code - The source code of javascript.
 * @param  {String} name - Plugin-name.
 * @param  {String} type - Plugin-type.
 * @return {Boolean} Evalute done, or not.
 */
JSmarty.Plugin.parse = function(code, name, type)
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
 * @param {String} ns Namaspace of plugin
 * @param {String} path The repository path of plugins. 
 * @type Boolean
 */
JSmarty.Plugin.addPlugin = function(ns, path)
{
	var plugins = this.plugins;
	if(ns in plugins) return plugins[ns];

	var i, code, flag = false;

	for(i=path.length-1;i>=0;i--)
	{
		code = this.fgets(path[i] + '/' + ns + '.js');
		if(code) break;
	};

	plugins.append(ns, flag);
	return flag;
};
/**
 * Load module.
 * @param {String} namespace
 * @param {String} filename
 * @type Boolean
 */
JSmarty.Plugin.addModule = function(filename, global)
{
};
/**
 * Load template is compiled.
 * @param {String} name
 * @type Boolean
 */
JSmarty.Plugin.addTemplatec = function(name)
{
};