/**
 * var_dump function
 *
 * @author shogo < shogo4405 at gmail dot com >
 * @version 0.9.0
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
	};
	return dump;
};

// display?
var_dump.is_display = true;

// var_dump.print = function(dump){};

var_dump._deploy = function(v, p, n)
{
	var s = new Array(n + 1).join(' ');
	var k, t, i = 0, a = [];

	switch(typeof(v))
	{
		case 'string':
			return p + 'string('+ v.length +') '+'"'+ v +'"';
		case 'number':
			return p + 'number('+ v +')';
		case 'function':
			return p + 'function';
		case 'boolean':
			return p + 'boolean('+ v +')';
		case 'object':
			t = 'Object';
			switch(true)
			{
				case (v instanceof Array):
					t = 'Array'; break;
				case (v instanceof String):
					t = 'String'; break;
				case (v instanceof Boolean):
					t = 'Boolean'; break;
				case (v instanceof Date):
					t = 'Date'; break;
			};
			for(k in v){
				a[i++] = '  ' + s + this._deploy(v[k], '['+ k +'] => ', n + 2);
			};
			return p + t + '('+ i +') {\n' + a.join('\n') + '\n' + s + '}';
		default:
			return p + 'undefined';
	};
};