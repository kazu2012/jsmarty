/**
 * strftime function
 *
 * @author shogo < shogo4405 at gmail dot com >
 * @version 0.0.1
 * @see http://www.php.net/strftime
 * @param  {String} format
 * @param  {Number} timestamp
 * @return {String}
 */
function strftime(format, timestamp)
{
	var val, d = new Date();

	d.setTime(timestamp);

	return format.replace(/%./, function($0)
	{
		switch($0)
		{
			case '%a':
				return '';
			case '%A':
				return '';
			case '%h':
			case '%b':
				return '';
			case '%B':
				return '';
			case '%c':
				return '';
			case '%C':
				return '';
			case '%d':
				return d.getDate();
			case '%D':
				return '%m/%d/%y';
			case '%e':
				return '';
			case '%g':
				return '';
			case '%G':
				return '';
			case '%H':
				return d.getHours();
			case '%I':
				val = d.getHours() - 12;
				return (val >= 0) ? val : d.getHours();
			case '%j':
				return '';
			case '%m':
				return '';
			case '%M':
				return '';
			case '%n':
				return '\n';
			case '%p':
				return '';
			case '%r':
				return '';
			case '%R':
				return '';
			case '%S':
				return '';
			case '%t':
				return '\t';
			case '%T':
				return '%H:%M:%S';
			case '%u':
				return '';
			case '%U':
				return '';
			case '%V':
				return '';
			case '%W':
				return '';
			case '%w':
				return '';
			case '%x':
				return '';
			case '%X':
				return '';
			case '%Y':
				return '';
			case '%Z':
				return '';
			case '%%':
				return '%';
		};
	});
};