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
	if(timestamp) d.setTime(timestamp);

	return format.replace(/%./g, function($0)
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
				return Math.ceil(d.getFullYear() / 100);
			case '%d':
				return d.getDate();
			case '%D':
				return strftime('%m/%d/%y', timestamp);
			case '%e':
				val = String(d.getMonth());
				return (val.length > 1) ? val : ' ' + val;
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
				val = (d.getTime() - new Date(d.getFullYear(), 0, 1).getTime());
				val = String(Math.ceil(val / 86400000));
				switch(val.length)
				{
					case 1: return '00' + val;
					case 2: return '0' + val;
				};
				return val;
			case '%m':
				return d.getMonth() + 1;
			case '%M':
				return d.getMinutes();
			case '%n':
				return '\n';
			case '%p':
				val = d.getHours() - 12;
				return (val >= 0) ? 'PM' : 'AM';
			case '%r':
				val = d.getHours() - 12;
				return (val >= 0) ? val : d.getHours();
			case '%R':
				return d.getHours();
			case '%S':
				return d.getSeconds();
			case '%t':
				return '\t';
			case '%T':
				return strftime('%H:%M:%S', timestamp);
			case '%u':
				val = d.getDay()
				return (val == 0) ? 7 : val;
			case '%U':
				val = (d.getTime() - new Date(d.getFullYear(), 0, 1).getTime());
				return Math.ceil(val / 604800000);
			case '%V':
				return '';
			case '%W':
				val = (d.getTime() - new Date(d.getFullYear(), 0, 1).getTime());
				return Math.floor(val / 604800000);
			case '%w':
				return d.getDay();
			case '%x':
				val = d.toLocaleString();
				return val.slice(0, val.indexOf(' '));
			case '%X':
				val = d.toLocaleString();
				return val.slice(val.indexOf(' '));
			case '%y':
				return String(d.getFullYear()).slice(-2);
			case '%Y':
				return d.getFullYear();
			case '%Z':
				return '';
			case '%%':
				return '%';
		};
	});
};