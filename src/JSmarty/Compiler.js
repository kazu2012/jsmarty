/**
 * FILE:
 * JSmarty/Compiler.js
 *
 * LICENCE:
 * This library is free software; you can redistribute it and/or modify
 * it under the LGPL2.1 as published by the Free Software Foundation.
 * See the http://www.gnu.org/licenses/lgpl.txt in this distribution.
 *
 * @author shogo < shogo4405 at gmail dot com>
 * @package JSmarty
 * @version @version@
 */

JSmarty.Compiler = function(renderer)
{
	var Tags = [], Block = {};

	var L = renderer.left_delimiter;
	var R = renderer.right_delimiter;

	var RcrRegExp = /\r?\n/g;
	var VarRegExp = /&&__COM__::__VAR__&&/g;
	var RmvRegExp = /\+""|B\[\+\+I\]=""\;\n/g;
	var BlcRegExp = RegExp(L + '\\/(.*?)' + R,'g');
	var RsvRegExp = /&&__COM__::__VAR__&&smarty\./g;
	var TagRegExp = RegExp(L + '[^'+ R +']*' + R,'g');

	/** plugins_dir **/
	this.plugins_dir = renderer.plugins_dir;

	/**
	 * SetRegExp function
	 */
	function SetRegExp()
	{
		BlcRegExp.compile(L + '\\/(.+?)' + R,'g');
		TagRegExp.compile(L + '[^'+ R +']+' + R,'g');
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

	// resolve namespaces
	var Compiler= JSmarty.Compiler;
	var Context = JSmarty.Compiler.Context;
	var Builder = JSmarty.Utility.StringBuilder;

	/**
	 * filter function
	 * @return {String}
	 */
	function filter()
	{
	};

	/**
	 * pattern function
	 */
	function pattern()
	{
	};

	/**
	 * delimiters function
	 */
	function delimiters()
	{
	};

	/**
	 * execute function
	 * compile a source
	 * @param {String} src source
	 */
	this.execute = function(src)
	{
		var t, m, r, p, isp, tag, iap = 0;
		var ilp = L.length, irp = -R.length;
		var cx = new Context(), buf = new Builder();

		buf.append
		(
			'var Builder = JSmarty.Utility.StringBuilder, ',
			'buf = Builder(), self = this;\n'
		);

		p = BlcRegExp;
		while((r = p.exec(src)) != null) cx.addNonterminal(r[1]);

		p = TagRegExp;
		while((r = p.exec(src)) != null)
		{
			tag = r[0];
			isp = src.indexOf(tag, iap);

			t = Compiler.newString(src.slice(iap, isp)); t.parse(cx);
			buf.append(t.prefix(), t.toString(), t.suffix());

			m = Compiler.newModule(tag.slice(ilp, irp)); m.parse(cx);
			buf.append(m.prefix(), m.toString(), m.suffix());

			iap = isp + tag.length;
		};

		t = Compiler.newString(src.slice(iap)); t.parse(cx);
		buf.append
		(
			t.prefix(), t.toString(),  t.suffix(),
			'return buf.toString();'
		);

		return buf.toString();
	};
};

JSmarty.Compiler.extend = function(s, o)
{
	var i, c = function(t){ this.text = t; };
	c.prototype = new this[s]();
	for(i in o) c.prototype[i] = o[i];
	return c;
};

JSmarty.Compiler.newString = function(t)
{
	var n = (t) ? '__STRING__' : '__NOTEXT__';
	return new this[n](t);
};

JSmarty.Compiler.newModule = function(t)
{
	var inp = 0, iap = imp = -1;
	var name, type, main = t.charAt(0);

	switch(main)
	{
		case '*':
			type = 'comment';
			break;
		case '#':
			type = 'config';
			break;
		case '"':
		case "'":
			type = 'intext';
			do{inp = text.indexOf(c, inp + 1);}
			while(t.charAt(inp - 1) == '\\');
			imp = t.indexOf('|', ++inp) + 1;
			break;
		case '$':
			type = 'variable';
			imp = t.indexOf('|');
			break;
		case '/':
			type = t.slice()
			break;
		default:
			type = 'function';
			iap = t.indexOf(' ');
			imp = t.indexOf('|');
			inp = (-1 < iap) ? iap++ : (-1 < imp) ? imp++ : t.length;
			name = t.slice(0, inp);
			break;
	};

	name = this.toUcfirst(name);
	type = this.toUcfirst(type);

	if(name in this) return new this[name](t);
	if(type in this) return new this[type](t);

	return new this.__NOTEXT__();
};

JSmarty.Compiler.toUcfirst = function(s){
	return s.charAt(0).toUpperCase().concat(s.slice(1));
};
