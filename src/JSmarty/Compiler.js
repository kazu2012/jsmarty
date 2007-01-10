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
	var Text    = JSmarty.Compiler.Text;
	var Module  = JSmarty.Compiler.Module;
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

			t = new Text(src.slice(iap, isp)); t.parse(cx);
			buf.append(t.prefix(), t.toString(), t.suffix());

			m = new Module(tag.slice(ilp, irp)); m.parse(cx);
			buf.append(m.prefix(), m.toString(), m.suffix());

			iap = isp + tag.length;
		};

		t = new Text(src.slice(iap)); t.parse(cx);
		buf.append
		(
			t.prefix(), t.toString(),  t.suffix(),
			'return buf.toString();'
		);

		return buf.toString();
	};
};