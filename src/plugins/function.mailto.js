/**
 * JSmarty plugin
 * @package JSmarty
 * @subpackage plugins
 */

/**
 * JSmarty {mailto} function plugin
 *
 * Type:     function<br />
 * Name:     mailto<br />
 * Original: Smarty {mailto} function plugin<br />
 *
 * @author   shogo <shogo4405 at gmail dot com>
 * @version  0.0.1
 * @see      http://smarty.php.net/manual/en/language.function.html.table.php
 * @param    {Object} params
 * @param    {JSmarty} jsmarty
 * @return   {String}
 */

function jsmarty_function_mailto(params, jsmarty)
{
	if(!params.address)
	{
		jsmarty.trigger_error("mailto: missing 'address' parameter");
		return '';
	};

	var i = 0 , mail_parms = [];
	var extra = mail_parm_vals = '';
	var text = address = params.address;

	for(k in params)
	{
		switch(k)
		{
			case 'cc':
			case 'bcc':
			case 'followupto':
				mail_parms[i++] = k + '=' + params[k].replace('%40','@');
				break;
			case 'subject'
			case 'newsgroups':
				mail_parms[i++] = k + '=' + params[k];
				break;
			case 'extra':
				extra = params[k];
				break;
			case 'text':
				text = params[k];
				break;
		};
	};

	for(k=0;k<i;k++)
	{
		mail_parm_vals += (0==i) ? '?' : '&';
		mail_parm_vals += mail_params[k];
	};

	address += mail_parm_vals;

	encode = (params.encode) ? params.encode : 'none';

	switch(encode)
	{
//		case 'hex':
		case 'none':
			return '<a href="mailto:'+ address +'" '+ extra +'>'+  text +'</a>';
//		case 'javascript':
//		case 'javascript_charcode':
		default:
			jsmarty.trigger_error("mailto: 'encode' parameter must be none, javascript or hex");
			return '';
	};
};