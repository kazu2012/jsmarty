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
					this.sString = 'self.inModify('+ m +',' + s + ')';
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
				this.sString = 'self.inModify('+ m +','+ n +')';
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
					this.sString = 'return buf.toString();}())';
					return;
				}

				this.sSuffix = 'function(){var buf = new Buffer();';
				this.sString =
					'self.inCall('+ this.getName() +',' + this.toParams() +
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
					'self.inCall('+ this.getName() +','+ this.toParams() +
					','+ this.toModify() +')';
			}
		},
		Ldelim :
		{
			sString : 'self.left_delimiter'
		},
		Rdelim :
		{
			sString : 'self.right_delimiter'
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
							if(s[i-1] == '\\') i--;
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
					this.sPrefix = 'buf.append(';
					this.sString = 'self.inModify(' + m + ',' + "'";
				};
			}
		},
		Foreach :
		{
			sSuffix : '',
			sPrefix : '',
			parse : function(c)
			{
				if(this.isTerminal())
				{
					this.sPrefix = '';
					this.sString = '};})();';
					return;
				};

				var m = this.toModify();
				var p = this.toParams();

				var n = this.extract(p, 'name');
				var f = this.extract(p, 'from');
				var k = this.extract(p, 'key') || 'k';
				var i = this.extract(p, 'item') || 'i';

				this.sString =
					'(function(){ for(var i in '+ f +'){' +
					'v.' + k + ' = ' + 'i;' +
					'v.' + i + ' = ' + f + '[i];';
			},
			extract : function(s, k)
			{
				var r = s.match(RegExp(k + ':(\'|"|)([^,}]+)\\1'));
				return (r) ? r[2] : '';
			}
		},
		Foreachelse :
		{
			sPrefix : '',
			sSuffix : '',
			sString : '}; if(false){'
		},
		Section :
		{
			parse : function(c)
			{
			}
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

JSmarty.Compiler.Sectionelse = JSmarty.Compiler.Foreachelse;