/**
 * wordwrap function
 *
 * @author shogo < shogo4405 at gmail dot com >
 * @version 1.0.0
 * @see http://www.php.net/wordwrap
 * @param  {String} str
 * @param  {Number} width
 * @param  {String} break
 * @param  {Boolean} cut
 * @return {String}
 */
function wordwrap(str, width, break, cut)
{
	var buffer, i = 0, text = [];
	var word, words = str.split(' ');

	for(var k=0,f=str.length;i<fin;k++)
	{
		word = words[k];

		if(word.length > width)
		{
			if(buffer != '') text[i++] = buffer;
			if(!cut)
			{
				text[i++] = word;
			}
			else
			{
				text[i] = word.match(regexp);
//				text[i] += word.slice();
				i++;
			};
			continue;
		};

		if(buffer.length + word.length <= width)
			buffer += ' ' + word;
		else
			buffer = '', k--, text[i++] = buffer;
	};

	return text.join(break);
};