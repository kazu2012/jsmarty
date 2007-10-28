/**
 * JSmarty plugin
 * @package JSmarty
 * @subpackage plugins
 */

/**
 * JSmarty id resource plugin
 *
 * Type:     resource<br />
 * Name:     id<br />
 *
 * @author   shogo < shogo4405 at gmail dot com>
 * @version  1.0.2
 * @type     Array
 */
var jsmarty_resource_id =
[
	/**
	 * get a template source
	 * @param {String} name Template name
	 * @param {Object} data Template data
	 * @param {JSmarty} jsmarty
	 * @return {Boolean} 
	 */
	function(name, item, renderer)
	{
		var element;
		try
		{
			item.put('src', document.getElementById(name).innerHTML);
			return true;
		}
		catch(e){ renderer.trigger_error(e); };

		return false;
	},
	/**
	 * get a template timestamp
	 * @param {String} name Template name
	 * @param {Object} data Template data
	 * @param {JSmarty} jsmarty
	 * @return {Boolean} 
	 */
	function(name, item, renderer)
	{
		try
		{
			item.put('timestamp', JSmarty.System.timestamp(document.lastModified));
		}
		catch(e)
		{
			item.put('timestamp', JSmarty.System.timestamp());
		};
		return true;
	},
	/**
	 * secure?
	 * @return {Boolean} true
	 */
	function(){ return true; },
	/**
	 * trusted?
	 * @return {Boolean} true
	 */
	function(){ return true; }
];