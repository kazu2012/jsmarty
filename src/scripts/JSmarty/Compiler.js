/**
 * @author shogo < shogo4405 at gmail dot com>
 * @package JSmarty
 * @version @version@
 */
JSmarty.Compiler = JSmarty.Classes.create
({
	/**
	 * left_delimiters
	 * @private
	 */
	$ldelim : null,
	/**
	 * right_delimiters
	 * @private
	 */
	$rdelim : null,

	init : function(renderer)
	{
		// resolve namespaces
		var Buffer = JSmarty.Classes.Buffer;
		var Context = JSmarty.Compiler.Context;
		var Compiler = JSmarty.Compiler;

		var L = renderer.left_delimiter;
		var R = renderer.right_delimiter;

		// regular expression
		var regcrl = /\r?\n/g
		var regtml = RegExp(L + '\\/(.*?)' + R,'g');
		var regtag = RegExp(L + '[^'+ R +']*' + R,'g');
		var regvar = RegExp(Compiler.VALSYMBL, 'g');
		var regsva = RegExp(Compiler.VALSYMBL + 'smarty\.', 'g');

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
					break;
				case 'post':
					s = s.replace(regsva,'$.$');
					s = s.replace(regvar,'$v.');
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
			context.set('plugins_dir', renderer.plugins_dir);

			// postfilter
			src = this.escape(src);

			buf.append(Compiler.HEADER);

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

			buf.append(
				t.prefix(), t.toString(),  t.suffix(),
				'return $b.toString();'
			);

			// prefilter
			return filter(buf.toString(), 'post');
		};

		this.getRenderer = function(){ return renderer; };
	},
	escape : function(src)
	{
		var $ = this.getRenderer(), L = $.left_delimiter, R = $.right_delimiter;
		return src.replace(RegExp('('+L+'[^'+R+']*'+R+')\\r?\\n', 'g'), '$1'
				).replace(/\\/g, '\\\\'
				).replace(/\t/g, '\\t'
				).replace(/\r?\n/g, '\\n');
	},
	isDelimiterChanged : function()
	{
		var $ = this.getRenderer();
		return !((this.$ldelim == $.left_delimiter) && (this.$rdelim == $.right_deliiter));
	},
	updatePatternObject : function(isDelimiterChanged)
	{
		if(!isDelimiterChanged){ return; };
	}
});

JSmarty.Classes.mixin(JSmarty.Compiler,
{
	VALSYMBL : '@@COMPILER::VARIABLE@@',
	FNCSYMBL : '@@COMPILER::FUNCTION@@',
	MODSYMBL : '@@COMPILER::MODIFIER@@',

	HEADER :
		'var $B = JSmarty.Classes.Buffer, $P = JSmarty.Plugin, $v = $.$vars, $b = new $B($);',
	PLAINELM : {strip:true,literal:true,javascript:true},

	toUcfirst : function(s){
		return s.slice(0,1).toUpperCase().concat(s.slice(1));
	},
	isBuiltIn : function(name){
		return (this.toUcfirst(name) in this);
	},
	escape : function(s){
		return s.replace(/\\/g, '\\\\').replace(/\t/g, '\\t').replace(/\r?\n/g, '\\n');
	},
	newString : function(src, ctx)
	{
		var module;
		module = (ctx.isPlain()) ? new this.Plains(src): new this.String(src);
		module.parse(ctx);
		return module;
	},
	newModule : function(t, c)
	{
		var m, imp, name, type, main = t.slice(0, 1);
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
				t = t.replace(/(\s)*->(\s)*/g, '.');
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
				if(c.isPlain()){ break; };
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
	}
});