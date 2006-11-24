/**
 * strftime function
 *
 * @package Date/Time
 * @author shogo < shogo4405 at gmail dot com >
 * @version 0.5.0
 * @see http://www.php.net/strftime
 * @param  {String} s format
 * @param  {Number} t timestamp
 * @return {String}
 */
function strftime(s, t)
{
	var i, v, a = s.split('');
	var d = (t) ? new Date(t) : new Date();

	for(i=0,f=s.length;i<=f;i++)
	{
		if(a[i] != '%') continue;

		a[i++] = '';
		switch(a[i])
		{
			case 'a':
				a[i] = '';
				break;
			case 'A':
				a[i] = '';
				break;
			case 'h':
			case 'b':
				a[i] = '';
				break;
			case 'B':
				a[i] = ['January','February','March','April','May','June','July','August','September','October','November','December'][d.getMonth()];
				break;
			case 'c':
				a[i] = '';
				break;
			case 'C':
				a[i] = Math.ceil(d.getFullYear() / 100);
				break;
			case 'd':
				a[i] = d.getDate();
				break;
			case 'D':
				a[i] = strftime('%m/%d/%y', t);
				break;
			case 'e':
				v = String(d.getMonth());
				a[i] = (v.length > 1) ? v : ' ' + v;
				break;
			case 'g':
				a[i] = '';
				break;
			case 'G':
				a[i] = '';
				break;
			case 'H':
				v = d.getHours();
				a[i] = (v < 10) ? '0' + v : v;
				break;
			case 'I':
				v = d.getHours();
				a[i] = (v < 12) ? v : v - 12;
				break;
			case 'j':
				a[i] = '';
				break;
			case 'm':
				a[i] = d.getMonth() + 1;
				break;
			case 'M':
				a[i] = d.getMinutes();
				break;
			case 'n':
				a[i] = '\n';
				break;
			case 'p':
				v = d.getHours();
				a[i] = (v < 12) ? 'PM' : 'AM';
				break;
			case 'r':
				v = d.getHours();
				a[i] = (v < 12) ? v : v - 12;
				break;
			case 'R':
				a[i] = d.getHours();
				break;
			case 'S':
				a[i] = d.getSeconds();
				break;
			case 't':
				a[i] = '\t';
				break;
			case 'T':
				a[i] = strftime('%H:%M:%S', t);
				break;
			case 'u':
				v = d.getDay();
				a[i] = (v == 0) ? 7 : v;
				break;
			case 'U':
				v = (d.getTime() - new Date(d.getFullYear(), 0, 1).getTime());
				a[i] = Math.ceil(v / 604800000);
				break;
			case 'V':
				a[i] = '';
				break;
			case 'W':
				v = (d.getTime() - new Date(d.getFullYear(), 0, 1).getTime());
				a[i] = Math.floor(v / 604800000);
				break;
			case 'w':
				a[i] = d.getDay();
				break;
			case 'x':
				v = d.toLocaleString();
				a[i] = v.slice(0, v.indexOf(' '));
				break;
			case 'X':
				v = d.toLocaleString();
				a[i] = v.slice(v.indexOf(' '));
				break;
			case 'y':
				a[i] = String(d.getFullYear()).slice(-2);
				break;
			case 'Y':
				a[i] = d.getFullYear();
				break;
			case 'Z':
				a[i] = '';
				break;
			case '%':
				a[i] = '%';
				break;
		};
	};

	return a.join('');
};