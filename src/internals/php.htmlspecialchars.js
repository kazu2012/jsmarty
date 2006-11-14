/**
 * htmlspecialchars function
 *
 * @author shogo < shogo4405 at gmail dot com >
 * @version 1.0.0RC1
 * @see http://www.php.net/htmlspecialchars
 * @param  {String} string
 * @param  {String} quote_style (ENT_COMPAT | ENT_QUOTES | ENT_NOQUOTES)
 * @return {String}
 */
function htmlspecialchars(string, quote_style)
{
	if(typeof(string) != 'string') return string.toString();

	string =
		string.replace(/&/g, '&amp;'
			 ).replace(/</g, '&lt;'
			 ).replace(/>/g, '&gt;');

	switch(quote_style)
	{
		case 'ENT_QUOTES':
			string = string.replace(/"/g, '&quot;'
						  ).replace(/'/g, '&#039;');
			break;
		case 'ENT_NOQUOTES':
			break;
		case 'ENT_COMPAT':
		default:
			string = string.replace(/"/g, '&quot;');
			break;
	};

	return string;
};