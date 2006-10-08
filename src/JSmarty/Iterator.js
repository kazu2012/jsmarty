/**
 * The factory of Iterator
 */
JSmarty.Iterator = {};
JSmarty.Iterator.Array = function(ary, args)
{

	for(var k in args)
	{
		switch(k)
		{
			case 'step':
				step = args[k]; break;
			case 'start':
				start = args[k]; break;
		};
	};

	return {
		next : function()
		{
			return prop;
		},
		hasNext : function()
		{
		},
		toString : function(){
			return i;
		}
	};
};