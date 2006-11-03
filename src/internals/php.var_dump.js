/**
 * var_dump function
 *
 * @author shogo < shogo4405 at gmail dot com >
 * @version 0.9.3
 * @see http://www.php.net/var_dump
 * @param  {mixed} exp
 * @return {String}
 */
function var_dump(exp)
{
	var dump = var_dump._deploy(exp, '', 0);
	switch(var_dump.is_display)
	{
		case false: break;
		case (typeof(var_dump.print) != 'undefined'):
			var_dump.print(dump); break;
		case (typeof(alert) != 'undefined'):
			alert(dump); break;
		case (typeof(print) != 'undefined'):
			print(dump); break;
		default: break;
	};
	return dump;
};

// display?
var_dump.is_display = true;
var_dump._deploy = function(v, p, n)
{
	var s = new Array(n + 1).join(' ');
	var c, k, t, i = 0, a = [];

	switch(typeof(v))
	{
		case 'string':
			return p + 'string('+ v.length +') '+'"'+ v +'"';
		case 'number':
			return p + 'number('+ v +')';
		case 'function':
			if(v instanceof RegExp){ return p + 'RegExp' };
			return p + 'function';
		case 'boolean':
			return p + 'boolean('+ v +')';
		case 'object':
			try{ if(v.toString() == void(0)) return p + '[object]'; }
			catch(e){ return p + '[object]'; };
			switch(true)
			{
				case (v == null):
					return p + 'null';
				case (v.toString().match(/^\[object\s(.+)\]/g) != null):
					t = RegExp.$1; break;
				case (v.constructor && v.constructor instanceof Function):
					if(v.constructor.toString().match(/function\s(.+)\(/g)){ t = RegExp.$1 };
					break;
				default: t = 'Object'; break;
			};
			try
			{
				for(k in v)
					a[i++] = '  ' + s + this._deploy(v[k], '['+ k +'] => ', n + 2);
			}
			catch(e){}; 
			return p + t + '('+ i +') {\n' + a.join('\n') + '\n' + s + '}';
		default:
			return p + 'undefined';
	};
};
