/**
 *
 * LICENCE:
 *
 * @author shogo < shogo4405 at gmail dot com>
 * @version @version@
 */

JSmarty.Compiler = function(renderer)
{
	var Tags = [];
	var ListOfBlock = {};

	var L = renderer.left_delimiter;
	var R = renderer.right_delimiter;

	var VarRegExp = /\$/;
	var RcrRegExp = /\r?\n/g;
	var RsvRegExp = /\$smarty\./;
	var TagRegExp = RegExp(L + '\\/(.+?)' + R,'g');
	var BlcRegExp = RegExp(L + '[^'+ R +']+' + R,'g');
	var TknRegExp = /eq|ne|neq|gt|lt|ge|gte|le|lte|not|and|or/g;

	var Plugin = JSmarty.Plugin, Compiler = JSmarty.Compiler;
	var PutString = null, StringBuffer = Compiler.StringBuffer;
	var OPERATORS = Compiler.OPERATORS;

	/**
	 * SetRegExp function
	 */
	function SetRegExp()
	{
		TagRegExp.compile(L + '\\/(.+?)' + R,'g');
		BlcRegExp.compile(L + '[^'+ R +']+' + R,'g');
	};
	/**
	 * SetHeader function
	 */
	function SetHeader()
	{
		PutString('var o, v = this._tpl_vars;');
		PutString('o = ');
	};
	/**
	 * SetHeader function
	 * @return {Boolean}
	 */
	function SetDelimiters()
	{
		var flag = false;
		if(L != renderer.left_delimiter ) flag = true, L = renderer.left_delimiter;
		if(R != renderer.right_delimiter) flag = true, R = renderer.right_delimiter;
		return flag;
	};
	/**
	 * GenModifier function
	 * @param  {String} s resource
	 * @return {String}
	 */
	function GenModifier(s)
	{
		var b = s.split('');
		for(i=0,f=s.length;i<=f;i++)
		{
			switch(b[i])
			{
				case ':':
					b[i] = ',';
					break;
				case '|':
					b[i] = '],';
					break;
			};
		};
		return '{' + b.join('') +']}';
	};
	/**
	 * GenReserved function
	 * @param  {String} s resource
	 * @return {String}
	 */
	function GenReserved(s){
	};
	/**
	 * GenVariable function
	 * @param  {String} s resource
	 * @return {String}
	 */
	function GenVariable(s){
		return (s.indexOf('smarty') >= 0) ? GenReserved(s) : 'v.' + src;
	};
	/**
	 * GenModule function
	 * @param  {String} s source
	 * @return {String}
	 */
	function GenModule()
	{
		if(Tags.length == 0)
		{
			
		}
		else
		{
			
		};
	};
	/**
	 * GenModule function
	 * @param  {String} s source
	 * @return {String}
	 */
	function GenString(src)
	{
	};

	function GenExpression(s){
		return s.replace(RsvRegExp,'this._').replace(VarRegExp,'v.').replace(TknRegExp,function($1){ return OPERATORS[$1]; });
	};

	/**
	 * GenAttributes function
	 * @param  {String} s resource
	 * @return {String}
	 */
	function GenAttributes(s)
	{
		var c, i, f, b = s.split('');

		for(i=0,f=s.length;i<=f;i++)
		{
			switch(b[i])
			{
				case ' ':
				case '\t':
				case '\r':
				case '\n':
					b[i++] = ',';
					while(b[i] <= ' ') b[i++] = '';
					break;
				case '$':
					b[i] = 'v.';
					break;
				case '=':
					b[i] = ':';
					break;
				case '"':
				case "'":
					c = b[i];
					while(b[++i] != c);
					if(b[i-1] == '\\') i--;
					break;
			};
		};

		return '{' + b.join('') + '}';
	};

	function ContentFilter()
	{
	};

	function ParseContent(src)
	{
	};

	this.execute = function(src)
	{
		var buffer= new StringBuffer();
		PutString = buffer.putString;
		if(SetDelimiters()) SetRegExp();
		return buffer.toString();
	};
};

JSmarty.Compiler.Module = function(){};
JSmarty.Compiler.Module.prototype = {};

/** StringBuffer **/
JSmarty.Compiler.StringBuffer = function()
{
	var p = 0, b = [];
	this.toString  = function( ){ return b.join(''); };
	this.putString = function(s){ return b[p++] = s; };
};

/** String Operators **/
JSmarty.Compiler.OPERATORS =
{
	eq : '==', ne : '!=', neq: '!=', gt : '>' ,
	lt : '<' , ge : '>=', gte: '>=', le : '<=',
	lte: '<=', not: '!' , and: '&&', or : '||'
};