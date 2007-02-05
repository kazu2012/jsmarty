JSmarty.Error = new function()
{
	var buf = new JSmarty.Buffer;

	/**
	 * trigger error
	 *
	 * @param {String}msg the error message
	 * @param {String}level error's level, none, warn or die
	 */
	this.raise = function(msg, level)
	{
		var prefix;

		switch(level)
		{
			case 'warn':
				prefix = 'JSmarty Error';
				JSmarty.System.print(prefix + msg);
				break;
			case 'die':
				prefix = 'JSmarty Fatal Error';
				throw new Error(prefix + msg);
				break;
			case 'none':
			default:
				break;
		};

		buf.append(prefix + msg);
	};

	/**
	 * display all error messages
	 */
	this.display = function(){
		JSmarty.System.print(buf.toString('\n'));
	};

	// toString
	this.toString = function(){
		return buf.toString('\n');
	};
};