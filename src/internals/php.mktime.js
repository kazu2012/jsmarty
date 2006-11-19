/**
 * mktime function
 *
 * @author shogo < shogo4405 at gmail dot com >
 * @version 1.0.0
 * @see http://www.php.net/mktime
 * @param  {Number} 0 hour
 * @param  {Number} 1 min
 * @param  {Number} 2 sec
 * @param  {Number} 3 month
 * @param  {Number} 4 day
 * @param  {Number} 5 year
 * @return {String}
 */
function mktime()
{
	var i, f, d = new Date();

	for(i=0,f=arguments.length;i<f;i++)
	{
		switch(i)
		{
			case 0:
				d.setHour(arguments[i]);
				break;
			case 1:
				d.setMinutes(arguments[i]);
				break;
			case 2:
				d.setSeconds(arguments[i]);
				break;
			case 3:
				d.setMonth(arguments[i]);
				break;
			case 4:
				d.setDay(arguments[i]);
				break;
			case 5:
				d.setFullYear(arguments[i]);
				break;
		};
	};

	return d.getTime();
};