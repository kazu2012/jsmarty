/**
 * Template compiling class
 * @package JSmarty
 */
JSmarty.Compiler = function(){};
(function(Class)
{
	Class.left_delimiter = '{';
	Class.right_delimiter = '}';

	Class._strops =
	{
		eq : '==', ne : '!=', lt : '<', gt : '>',
		not : '!', and : '&&', or : '||'
	};
	Class._rtoken = /eq|ne|lt|gt|not|and|or/g,
	Class._rextag = new RegExp();
	Class._rblock = new RegExp();
	Class._rexvar = /\$/g;
	Class._recrlf = /\r?\n/g;
	Class._reattr = /(\w+)=(\'|\"|)([^\s]+|[^\2]+?)\2/g;
	Class._folded_blocks = {};

	/**
	 * 
	 * 
	 */
	Class._compile_file = function(src)
	{
		var list = this._folded_blocks;
		var iap, isp, i = 0, txt = [], self = this;
		var L = this.left_delimiter , l = L.length;
		var R = this.right_delimiter, r = R.length;

		this._rextag.compile(L + '[^'+ R +']+' + R,'g');
		this._rblock.compile(L + '\\/(.+?)' + R,'g');

		txt[i++] = 'var output = ';

		src = src.replace(this._recrlf,'');
		src.replace(this._rblock, function($0, $1){
			list[$1] = true; return '';
		});

		src.replace(this._rextag, function(tag, isp, src)
		{
			// Normal Text
			if(iap != isp)
				txt[i++] = self._string(src.slice(iap, isp));
			// Template Tag
			txt[i++] = self._compile_tag(tag, l, tag.length - r);
			iap = isp + tag.length;
			return '';
		});

		txt[i++] = this._quote(src.slice(iap));
		txt[i++] = '; return output;'

		return txt.join('');
	};
	/**
	 *
	 *
	 */
	Class._compile_tag = function(tag, isp, iep)
	{
		var inp = irp = iep;
		var attr, close = '';
		var iap = tag.indexOf(' ');
		var imp = tag.indexOf('|');

		if(imp > 0) inp = imp, irp = imp;
		if(iap > 0) inp = iap;

		var name = tag.slice(isp, inp);

		switch(name)
		{
			case 'if':
				attr = this._token(tag.slice(iap + 1, irp));
				return "''; if("+ attr +"){ output += ";
			case '/if':
				return "'';}output += ";
			case 'elsif':
				attr = this._token(tag.slice(iap + 1, irp));
				return "'';}else if("+ attr +"){ output += ";
			case 'else':
				return "'';}else { output += ";
			case 'ldelim':
				return 'this.left_delimiter + ';
			case 'rdelim':
				return 'this.right_delimiter + ';
			case 'literal':
				return '';
			case '/literal':
				return '';
		};

		switch(tag.charAt(isp))
		{
			case '*':
				return this._quote();
			case '"':
			case "'":
				return this._quote(tag.slice(isp + 1, inp));
			case '/':
				return this._tagclose("'block'");
			case '$':
				return this._variable(tag.slice(isp + 1, inp)) + ' + ';
		};

		if(!this._folded_blocks[name])
			close = this._tagclose("'function'");

		name = this._quote(name);
		attr = this._attribute(tag.slice(iap + 1, irp));
		return this._tagopen(name, attr) + close;
	};
	/**
	 * Argument ToString
	 * @param string
	 * @return string
	 */
	Class._string = function(src)
	{
		if(!src) return "'' + ";
		return "'"+ src + "' + ";
	};
	/**
	 * Return Quoted String
	 * @param string
	 * @return string
	 */
	Class._quote = function(src)
	{
		if(!src) return "''";
		return "'"+ src + "'";
	};
	/**
	 * Argument ToVariable
	 * @param string
	 * @return string
	 */
	Class._variable = function(src){
		return 'this._tpl_vars.' + src;
	};
	/**
	 * JSmarty Reserved Variables
	 * @param string
	 * @return string
	 */
	Class._reserved = function(src)
	{
		var vars = src.split('.');
		switch(vars[1])
		{
			case 'version':
				return 'this._version';
			default:
				return '';
		};
	};
	/**
	 * Tag Open
	 * @param string
	 * @return string
	 */
	Class._tagopen = function(name, attr){
		return 'this._call('+ [name, attr, ''].join(',');
	};
	/**
	 * Tag Close
	 * @return string
	 * @return string
	 */
	Class._tagclose = function(type){
		return "''" + ","+ type + ") + ";
	};
	/**
	 * Argument ToAttribute
	 * @param string
	 * @return string
	 */
	Class._attribute = function(src)
	{
		var i = 0, attr = [], self = this;
		src.replace(this._reattr, function($0, $1, $2, $3)
		{
			switch($3.charAt(0))
			{
				case '$':
					$3 = self._variable($3.slice(1));
					break;
				default:
					$3 = self._quote($3);
					break;
			};

			attr[i++] = $1 + ':' + $3;
			return '';
		});
		return '{'+ attr.join(',') +'}';
	};
	/**
	 * Arguments ToToken
	 * @param string
	 * @return string
	 */
	Class._token = function(src)
	{
		var ops = this._strops;
		src  = src.replace(this._rexvar, 'this._tpl_vars.');
		return src.replace(this._rtoken, function($1){ return ops[$1]; });
	};
})(JSmarty.Compiler.prototype)