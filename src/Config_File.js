/**
 * File:    Config_File.js
 *
 * This library is free software. License under the GNU Lesser General
 * Public License as published by the Free Software Foundation(LGPL).
 *
 * @link http://d.hatena.ne.jp/shogo4405/
 * @author shogo < shogo4405 at gmail dot com >
 * @version @version@
 */

/**
 * Construct a new Config_File obejct.
 *
 * @class Config file reading class
 * @constructor
 */
function Config_File(config){
	if(config) this.set_path(config);
};

Config_File.prototype =
{
	overwrite : true,
	booleanize : true,
	read_hidden : true,
	fix_newlines : true,
	_trigger_error : function(msg, level)
	{
		switch(level)
		{
			case 'warn':
			case 'die':
			default:
		}
	}
};