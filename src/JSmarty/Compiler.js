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
	// resolve namespaces
	var Buffer = JSmarty.Buffer;
	var Compiler = JSmarty.Compiler;
	var Context = JSmarty.Compiler.Context;

	var L = renderer.left_delimiter;
	var R = renderer.right_delimiter;

	// regular expression
	var regcrl = /\r?\n/g
	var regvar = /@@COMPILER::VARIABLE@@/g;
	var regsva = /@@COMPILER::VARIABLE@@smarty\./g;
	var regtml = RegExp(L + '\\/(.*?)' + R,'g');
	var regtag = RegExp(L + '[^'+ R +']*' + R,'g');

	/**
	 * filter function
	 * @return {String} s source
	 * @return {String} t type of filter
	 */
	function filter(s, t)
	{
		switch(t)
		{
			case 'pre':
				s = s.replace(regcrl,'\\n');
			//	s = renderer.inFilter('pre', s);
				break;
			case 'post':
				s = s.replace(regsva,'self._');
				s = s.replace(regvar,'v.');
			//	s = renderer.inFilter('post', s);
				break;
		};

		return s;
	};

	/**
	 * pattern function
	 */
	function pattern()
	{
		regtml.compile(L + '\\/(.*?)' + R,'g');
		regtag.compile(L + '[^'+ R +']*' + R,'g');
	};

	/**
	 * delimiters function
	 */
	function delimiters()
	{
		var flag = false;

		if(L != renderer.left_delimiter)
		{
			flag = true;
			L = renderer.left_delimiter;
		}
		if(R != renderer.right_delimiter)
		{
			flag = true;
			R = renderer.right_delimiter;
		};

		return flag;
	};

	/**
	 * execute function
	 * compile a source
	 * @param {String} src source
	 */
	this.execute = function(src)
	{
		var buf = new Buffer();
		var context = new Context();
		var t, m, r, p, isp, tag, iap = 0;
		var ilp = L.length, irp = -R.length;

		if(delimiters()) pattern();

		context.set('ldelim', renderer.left_delimiter);
		context.set('rdelim', renderer.right_delimiter);

		// postfilter
		src = filter(src, 'pre');

		buf.append
		(
			'var Buffer = JSmarty.Buffer,',
			'v = this._vars_,',
			'buf = new Buffer(), self = this;'
		);

		// lookup block elements
		p = regtml;
		while((r = p.exec(src)) != null){
			context.addElement('block', r[1]);
		};

		// compile source
		p = regtag;
		while((r = p.exec(src)) != null)
		{
			tag = r[0];
			isp = src.indexOf(tag, iap);

			t = Compiler.newString(src.slice(iap, isp), context);
			buf.append(t.prefix(), t.toString(), t.suffix());

			m = Compiler.newModule(tag.slice(ilp, irp), context);
			buf.append(m.prefix(), m.toString(), m.suffix());

			iap = isp + tag.length;
		};

		t = Compiler.newString(src.slice(iap), context);

		buf.append
		(
			t.prefix(), t.toString(),  t.suffix(),
			'return buf.toString();'
		);

		// prefilter
		return filter(buf.toString(), 'post');
	};
};

/**
 * define function
 * @param {String} s the name of superclass.
 * @param {Object} o definitive list
 */
JSmarty.Compiler.define = function(s, o)
{
	var i, c, d, p = this[s];
	for(i in o)
	{
		d = o[i];
		c = function(t){ this.text = t; };
		c.prototype = new p();
		c.prototype.parent = p.prototype;
		for(k in d){ c.prototype[k] = d[k]; };
		this[i] = c;
	};
};

/**
 * newString function
 * The factory for Compiler's String object.
 * @param {String} t text
 * @param {String} c context
 * @return {Compiler.String}
 **/
JSmarty.Compiler.newString = function(t, c)
{
	var m = (c.isPlain()) ? new this.Plains(t) : new this.String(t);
	m.parse(c);
	return m;
};

JSmarty.Compiler.newModule = function(t, c)
{
	var m, name, type, main = t.slice(0, 1);
	var inp = 0, iap = imp = -1, plain = c.isPlain();

	switch(main)
	{
		case '*':
			m = new this.String();
			break;
		case '#':
			m = new this.String();
			break;
		case '"':
		case "'":
			do{ inp = t.indexOf(main, inp + 1); }
			while(t.charAt(inp - 1) == '\\');
			m = new this.String(t);
			m.set('imp', t.indexOf('|', ++inp) + 1);
			m.set('sString', t.slice(0, inp));
			break;
		case '$':
			imp = t.indexOf('|');
			inp = (-1 < imp) ? imp++ : t.length;
			m = new this.Variable(t);
			m.set('imp', imp);
			m.set('name', t.slice(1, inp));
			break;
		case '/':
			name = this.toUcfirst(c.setTree(t.slice(1), true));
			type = this.toUcfirst(c.typeOf(name.toLowerCase()));
			m = (name in this) ? new this[name](t) : new this[type](t);
			break;
		default:
			iap = t.indexOf(' ');
			imp = t.indexOf('|');
			inp = (-1 < iap) ? iap++ : (-1 < imp) ? imp++ : t.length;
			name = this.toUcfirst(c.setTree(t.slice(0, inp), false));
			type = this.toUcfirst(c.typeOf(name.toLowerCase()));
			m = (name in this) ? new this[name](t) : new this[type](t);
			m.set('iap', iap);
			m.set('imp', imp);
			m.set('bTerminal', false)
			m.set('name', name.toLowerCase());
			break;
	};

	if(plain && c.isPlain()){
		m = new this.Plainm(t);
	};

	m.parse(c);
	return m;
};

JSmarty.Compiler.toUcfirst = function(s){
	return s.slice(0,1).toUpperCase().concat(s.slice(1));
};
