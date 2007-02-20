JSmarty.Error = new function()
{
	var buf = new JSmarty.Buffer();

	/**
	 * trigger error
	 *
	 * @param {String} m the error message
	 * @param {String} l error's level, none, warn or die
	 */
	this.raise = function(m, l)
	{
		var p = 'JSmarty Error';

		switch(l)
		{
			case 'warn':
				JSmarty.System.print(p, m);
				break;
			case 'die':
				p = 'JSmarty Fatal Error';
				throw new Error(p + m);
				break;
			case 'none':
			default:
				break;
		};

		buf.append(p, m);
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
