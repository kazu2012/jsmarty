/**
 * var_dump function
 *
 * @author shogo < shogo4405 at gmail dot com >
 * @version 0.9.2
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

// var_dump.print = function(dump){};

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
			switch(true)
			{
				case (v.constructor && v.constructor instanceof Function):
					if(v.constructor.toString().match(/^function (.+)\(/)){ t = RegExp.$1 };
					break;
				default:
					t = 'Object', c = 'false';
					if(v == null) return p + 'null';
					break;
			};
			try
			{
				for(k in v)
				{
					if(c && k == 'constructor') continue;
					a[i++] = '  ' + s + this._deploy(v[k], '['+ k +'] => ', n + 2);
				};
			}
			catch(e){ return p + 'XMLHttpRequestObject'; };
			return p + t + '('+ i +') {\n' + a.join('\n') + '\n' + s + '}';
		default:
			return p + 'undefined';
	};
};