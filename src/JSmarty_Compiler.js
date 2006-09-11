/**
 * File:    JSmarty_Compiler.js
 *
 * This library is free software. License under the GNU Lesser General
 * Public License as published by the Free Software Foundation(LGPL).
 *
 * @link http://d.hatena.ne.jp/shogo4405/20060727/1153977238
 * @author shogo < shogo4405 at gmail dot com >
 * @version 0.0.1M2
 */

/**
 * Construct a new Compiler object.
 *
 * @class This is the template compiling class.
 * @constructor
 */
JSmarty.Compiler = function(){};
JSmarty.Compiler.STROPS =
{
	eq : '==', ne : '!=', lt : '<', gt : '>',
	not : '!', and : '&&', or : '||'
};
JSmarty.Compiler.prototype =
{
	_strops : JSmarty.Compiler.STROPS,
	_rtoken : /eq|ne|lt|gt|not|and|or/g,
	_rextag : new RegExp(),
	_rblock : new RegExp(),
	_rexvar : /\$/g,
	_recrlf : /\r?\n/g,
	_reattr : /(\w+)=(\'|\"|)([^\s]+|[^\2]+?)\2/g,
	_remove : / \+''/g,
	_folded_blocks : {},

	_tag_stack : 'none',
	_tag_count : 0,

	/**
	 * compile a resource
	 *
	 * @param  {String} src
	 * @param  {JSmarty} jsmarty
	 * @return {Boolean}
	 */
	_compile_file : function(src, jsmarty)
	{
		var flag = this._tag_flags;
		var list = this._folded_blocks;
		var k, iap, isp, i = 0, txt = [], self = this;
		var L = jsmarty.left_delimiter , l = L.length;
		var R = jsmarty.right_delimiter, r = R.length;

		this._rextag.compile(L + '[^'+ R +']+' + R,'g');
		this._rblock.compile(L + '\\/(.+?)' + R,'g');

		txt[i++] = 'var output = ';

		//prefilter
		src = src.replace(this._recrlf,'\\n');

		src.replace(this._rblock, function($0, $1){
			list[$1] = true;
		});

		src.replace(this._rextag, function(tag, isp, src)
		{
			txt[i++] = self._string(src.slice(iap, isp));
			txt[i++] = self._compile_tag(tag, l, tag.length - r);
			iap = isp + tag.length;
		});

		txt[i++] = this._quote(src.slice(iap));
		txt[i++] = '; return output;'

		txt = txt.join('').replace(this._remove, '');

		try{
			return new Function(txt);
		}catch(e){
			jsmarty.trigger_error('Compiler : '+ e.message);
		};

		return function(){};
	},
	/**
	 * Compile a template tag
	 *
	 * @param  {String} tempalte_tag
	 * @param  {Number} isp
	 * @param  {Number} iep
	 * @return {String}
	 */
	_compile_tag : function(tag, isp, iep)
	{
		switch(this._tag_stack)
		{
			case 'literal':
				if(tag.indexOf('/literal') >= 0)
				{
					if(this._tag_count == 0)
					{
						this._tag_stack = 'none';
						return '';
					}
					this._tag_count--;
				}
				else if(tag.indexOf('literal') >= 0)
					this._tag_count++;

				return this._string(tag);
				break;
			default:
				break;
		};

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
				this._tag_stack = 'literal';
				return '';
			case 'strip':
				return 'String(';
			case '/strip':
				return "'').replace(/\\s|\\n/g,'') + ";
			case 'foreach':
			case 'section':
				attr = this._attribute(tag.slice(iap + 1, irp));
				return "this._in"+ name +"("+ attr +", function(){ var output = ";
			case 'foreachelse':
			case 'sectionelse':
				return " ''; return output; }, function(){ var output = ";
			case '/foreach':
			case '/section':
				return " ''; return output; }) +";
			case 'javascript':
				return "this._eval(";
			case '/javascript':
				return "'')";
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
	},
	/**
	 * TagOpen
	 * @param  {String} name TagName
	 * @param  {String} attr Parameters
	 * @return {String} this._call(name, attr)
	 */
	_tagopen : function(name, attr){
		return 'this._call('+ [name, attr, ''].join(',');
	},
	/**
	 * TagClose
	 * @param  {String} src
	 * @return {String}
	 */
	_tagclose : function(type){
		return "''" + ","+ type + ") + ";
	},
	/**
	 * ToAttribute, object literal
	 * 
	 * @param  {String} src
	 * @return {String}
	 */
	_attribute : function(src)
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
	},
	/**
	 * The expression is substituted for JavaScript. 
	 * 
	 * @param  {String} src
	 * @return {String}
	 */
	_token : function(src)
	{
		var ops = this._strops;
		src  = src.replace(this._rexvar, 'this._tpl_vars.');
		return src.replace(this._rtoken, function($1){ return ops[$1]; });
	},
	/**
	 * ToString, with '+' token
	 * 
	 * @param  {String} src
	 * @return {String}
	 */
	_string : function(src)
	{
		if(!src) return "'' + ";
		if(src.indexOf("'"))
			src = src.split("'").join("\\'");
		return "'"+ src + "' + ";
	},
	/**
	 * ToString, quoted
	 * @param  {String} src
	 * @return {String}
	 */
	_quote : function(src)
	{
		if(!src) return "''";
		src = src.split("'").join("\\'");
		return "'"+ src + "'";
	},
	/**
	 * ToVariable
	 * @param  {String} src
	 * @return {String}
	 */
	_variable : function(src){
		return 'this._tpl_vars.' + src;
	},
	/**
	 * ToVariable, JSmarty Reserved 
	 * @param  {String} src
	 * @return {String}
	 */
	_reserved : function(src)
	{
		var vars = src.split('.');
		switch(vars[1])
		{
			case 'version':
				return 'this._version';
			default:
				return '';
		};
	}
};

