JSmarty.Error = new function()
{
	var buf = JSmarty.Buffer.create();

	/**
	 * error toggle
	 * @param {String} f message from
	 * @param {String} m the error message
	 * @param {String} l error's level, none, warn or die
	 */
	this.log = function(f, m, l)
	{
		switch(l)
		{
			case 'warn':
				buf.append('JSmarty Error: ', f, ': ', m);
				JSmarty.System.outputString(buf.get(-1));
				break;
			case 'die':
				buf.append('JSmarty Fatal Error: ', f, ': ', m);
				throw new Error(buf.get(-1));
				break;
			case 'none':
			default:
				buf.append('JSmarty Error: ', f, ': ', m);
				break;
		};
	};

	/** toString **/
	this.toString = function(){
		return buf.toString('\n');
	};
};
