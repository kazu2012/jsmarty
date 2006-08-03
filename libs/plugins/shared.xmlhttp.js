/**
 * JSmarty plugin
 * @package JSmarty
 * @subpackage plugins
 */

function jsmarty_shared_xmlhttp()
{
	if(window.XMLHttpRequest)
		return new XMLHttpRequest();

	if(window.ActiveXObject)
	{
		var xmls = [
			'Microsoft.XMLHTTP',
			'Msxml2.XMLHTTP',
			'Msxml2.XMLHTTP.3.0',
			'Msxml2.XMLHTTP.4.0',
			'Msxml2.XMLHTTP.5.0'
		];

		for(var i=xmls.length-1;i>=0;i--)
		{
			try{
				return new ActiveXObject(xmls[i]);
			}
			catch(e){}
		}
	}

	return null;
};