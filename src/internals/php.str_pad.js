/**
 * str_pad function
 *
 * @author shogo < shogo4405 at gmail dot com >
 * @version 1.0.0RC1
 * @see http://www.php.net/str_pad
 * @param  {String} v input
 * @param  {Number} l pad_length
 * @param  {String} s pad_string
 * @param  {String} t pad_type ( STR_PAD_LEFT | STR_PAD_BOTH | STR_PAD_RIGHT )
 * @return {String}
 */
function str_pad(v, l, s, t)
{
	if(l < 0 || l < v.length) return v;
	if(s == void(0)) s = ' ';

	var p = Array(Math.ceil((l - v.length) / s.length) + 1).join(s);

	switch(t)
	{
		case 'STR_PAD_LEFT':
			return p + v;
		case 'STR_PAD_BOTH':
			return '';
		case 'STR_PAD_RIGHT':
		default:
			return v + p;
	};
};