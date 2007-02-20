JSmarty.Error = new function()
{
	var buf = new JSmarty.Buffer();

	/**
	 * trigger error
	 *
	 * @param {String}msg the error message
	 * @param {String}level error's level, none, warn or die
	 */
	this.raise = function(msg, level)
	{
		var pre = '';

		switch(level)
		{
			case 'warn':
				pre = 'JSmarty Error';
				JSmarty.System.print(pre, msg);
				break;
			case 'die':
				pre = 'JSmarty Fatal Error';
				throw new Error(pre + msg);
				break;
			case 'none':
			default:
				break;
		};

		buf.append(pre, msg);
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
