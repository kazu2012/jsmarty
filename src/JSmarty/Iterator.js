/**
 * The factory of Iterator
 */
JSmarty.Iterator = {};
JSmarty.Iterator.Array = function()
{
	var idx = -1;
	var max = '';
	var nxt = 0;
	var prv = 0;
	var stp = 0;

	return {
		step : function()
		{
			idx += stp;
			if(idx == max)
				return false;
			return true;
		},
		getElement : function()
		{
			return ary[idx];
		},
		getProperty : function()
		{
			return {
				index  : index,
				rownum : rownum,
				iteration : iterarion,
			};
		}
	};
};