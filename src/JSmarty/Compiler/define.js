JSmarty.Compiler.define
(
	'Module',
	{
		String :
		{
			sString : '',
			parse : function(c)
			{
				if(this.sString == '')
				{
					this.sString = this.quote(this.getText());
					return;
				};

				if(this.sString != '')
				{
					var m = this.toModify();
					var s = this.escape(this.sString);
					this.sString = '$.$m('+ m +',' + s + ')';
					return;
				};

				this.sPrefix = '';
				this.sSuffix = '';
			}
		},
		Variable :
		{
			parse : function(c)
			{
				var m = this.toModify();
				var n = JSmarty.Compiler.VALSYMBL + this.get('name');
				this.sString = '$.$m('+ m +','+ n +')';
			}
		},
		Plains :
		{
			sPrefix : '',
			sSuffix : '',
			sString : '',
			parse : function(c){
				this.sString = this.getText();
			}
		},
		Plainm :
		{
			parse : function(c)
			{
				this.sPrefix = c.get('ldelim');
				this.sSuffix = c.get('rdelim');
				this.sString = this.getText();
			}
		},
		Block :
		{
			parse : function(c)
			{
				if(this.isTerminal())
				{
					this.sPrefix = '';
					this.sString = 'return $b.toString();}())';
					return;
				}

				this.sSuffix = 'function(){var $b = new Buffer();';
				this.sString =
					'$.$p('+ this.getName() +',' + this.toParams() +
					','+ this.toModify() +',';
			},
			genString : function(){
			}
		},
		Function :
		{
			parse : function(c)
			{
				this.sString =
					'$.$p('+ this.getName() +','+ this.toParams() +
					','+ this.toModify() +')';
			}
		},
		Ldelim :
		{
			sString : '$.left_delimiter'
		},
		Rdelim :
		{
			sString : '$.right_delimiter'
		},
		If :
		{
			sSuffix : '',
			sPrefix : '',
			OPERATORS :
			{
				eq : '==', ne : '!=', neq: '!=', gt : '>' ,
				lt : '<' , ge : '>=', gte: '>=', le : '<=',
				lte: '<=', not: '!' , and: '&&', or : '||',
				mod: '%'
			},
			parse : function(c)
			{
				if(this.isTerminal())
				{
					this.sString = '}\n';
					return;
				};

				this.sString = 'if('+ this.toExpression() +'){';
			},
			toExpression : function()
			{
				var iap = this.get('iap'), op = this.OPERATORS;
				var i, f, c, s = this.text.slice(this.iap).split('');

				outerloop:
				for(i=0,f=s.length;i<=f;i++)
				{
					switch(s[i])
					{
						case '$':
							s[i++] = JSmarty.Compiler.VALSYMBL;
							break;
						case '"':
						case "'":
							c = s[i++];
							while(s[i] != c && i <= f){ ++i; };
							if(f + 1 < i){ this._error(); };
							if(s[i-1] == '\\'){ i--; };
							break;
						case ' ':
							c = '';
							while(s[++i] != ' ' && i <= f){
								c += s[i], s[i] = '';
							};
							if(f + 1 < i){ this._error(); };
							s[i] = ((op[c]) ? op[c] : c) + ' ';
							break;
						case '|':
							s.splice(i);
							break outerloop;
					};
				};

				return s.join('');
			}
		},
		Else :
		{
			sPrefix : '',
			sSuffix : '',
			sString : '}else{'
		},
		Literal :
		{
			sPrefix : '',
			sSuffix : '',
			sString : '\'));',
			parse : function(c)
			{
				if(!this.isTerminal())
				{
					var m = this.toModify();
					this.sPrefix = '$b.append(';
					this.sString = '$.$m(' + m + ',' + "'";
				};
			}
		},
		Foreach :
		{
			sSuffix : '',
			parse : function(c)
			{
				if(this.isTerminal())
				{
					this.sPrefix = '';
					this.sString = '};return $b.toString();}()));';
					return;
				};

				var b = JSmarty.Buffer.create();
				var p = this.toObject(this.toParams());

				b.append
				(
					'$.$m(', this.toModify(), ',',
					'function(){var $b = new Buffer();'
				);
				b.appendIf(p.name)
				(
					'$.$foreach.', p.name,'={total:0,index:-1,iteration:0};',
					'var $f=$.$foreach.', p.name,';',
					'$f.first=true,$f.last=false;',
					'for(var k in ', p.from, '){$f.total++;};'
				);
				b.append('for(var k in ', p.from, '){');
				b.appendIf(p.key)('$v.', p.key, '=k;');
				b.appendIf(p.item)('$v.', p.item, '=', p.from, '[k];');
				b.appendIf(p.name)
				(
					'$f.index++, $f.iteration++;',
					'$f.first=($f.index==0), $f.last=($f.iteration==$f.total);'
				);

				this.sString = b.toString('\n');
			}
		},
		Foreachelse :
		{
			sPrefix : '',
			sSuffix : '',
			sString : '}; if(!k){'
		},
		Section :
		{
			sSuffix : '',
			parse : function(c)
			{
				if(this.isTerminal())
				{
					this.sPrefix = '';
					this.sString = '};return $b.toString();}()));';
					return;
				};

				var p = this.toObject(this.toParams());
				var e, k = p.name || 'i', b = JSmarty.Buffer.create();

				e =	k +'=' + (p.start || 0) + ';'+ k +'<=' +
					(p.max || p.loop + '.length-1') + ';'+ k +'+='+ (p.step || 1);

				b.append
				(
					'$.$m(', this.toModify(), ',',
					'function(){var ', k,', $b = Buffer.create();'
				);
				b.appendIf(p.name)
				(
					'$.$section.', p.name,'={total:0,index:-1,iteration:0};',
					'var $l=$.$section.', p.name,';',
					'$l.first=true,$l.last=false;',
					'for(', e,'){$l.total++;};'
				);
				b.append('for(', e, '){');
				b.appendIf(p.name)
				(
					'$l.index++, $l.rownum = $l.iteration++;',
					'$l.first=($l.index==0), $l.last=($l.iteration==$l.total);'
				);

				this.sString = b.toString('\n');
			}
		},
		Sectionelse :
		{
			sPrefix : '',
			sSuffix : '',
			sString : '}; if(0){'
		}
	}
);

JSmarty.Compiler.define
(
	'If',
	{
		Elseif :
		{
			parse : function(c){
				this.sString = '}else if('+ this.toExpression() +'){';
			}
		}
	}
);

JSmarty.Compiler.define
(
	'Literal',
	{
		Strip :
		{
			sString : '\').replace(/\\n/g,\'\')));',
			parse : function(c)
			{
				this.parent.parse.call(this, c);
				if(!this.isTerminal()){
					this.sString += '\'+(\'';
				};
			}
		}
	}
);