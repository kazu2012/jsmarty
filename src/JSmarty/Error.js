JSmarty.Error = new function()
{
	var buf = new JSmarty.Buffer();

	/**
	 * trigger error
	 * @param {String} m the error message
	 * @param {String} l error's level, none, warn or die
	 */
	this.raise = function(m, l)
	{
		switch(l)
		{
			case 'warn':
				buf.append('JSmarty Error: ', m);
				JSmarty.System.print(buf.get(-1));
				break;
			case 'die':
				buf.append('JSmarty Fatal Error: ', m);
				throw new Error(buf.get(-1));
				break;
			case 'none':
			default:
				buf.append('JSmarty Error: ', m);
				break;
		};
	};

	/** toString **/
	this.toString = function(){
		return buf.toString('\n');
	};
};
