/**
 * JSmarty plugin
 * @package JSmarty
 * @subpackage plugins
 */

/**
 * JSmarty string resource plugin
 *
 * Type:     resource<br />
 * Name:     string<br />
 *
 * @author   shogo < shogo4405 at gmail dot com>
 * @version  1.0.0
 * @type     Array
 */

var jsmarty_resource_string =
[
	/**
	 * get a template source
	 * @param {String} name Template name
	 * @param {Object} data Template data
	 * @param {JSmarty} jsmarty
	 * @return {Boolean} 
	 */
	function(name, resource, jsmarty)
	{
		resource.set('src', name);
		return true;
	},
	/**
	 * get a template timestamp
	 * @param {String} name Template name
	 * @param {Object} data Template data
	 * @param {JSmarty} jsmarty
	 * @return {Boolean} 
	 */
	function(name, resource, jsmarty)
	{
		resource.set
		(
			'timestamp',
			((typeof(document) != 'undefined') && document.lastModified) ?
			document.lastModified : new Date().getTime()
		);
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
