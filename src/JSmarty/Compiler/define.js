JSmarty.Compiler.define
(
	'__MODULE__',
	{
		String :
		{
			sString : '',
			parse : function(c)
			{
				if(this.sString == '')
				{
					this.sString = this.quoteText(this.escapeText());
					return;
				};

				if(this.sString != '')
				{
					var m = this.toModifier();
					var s = this.escapeText( this.sString );
					this.sString = 'self.inModify('+ m +',' + s + ')';
					return;
				};

				this.sPrefix = '';
				this.sSuffix = '';
			},
		},
		Variable :
		{
			parse : function(c)
			{
				var m = this.toModifier();
				var n = '@@COMPILER::VARIABLE@@' + this.getValue('name');
				this.sString = 'self.inModify('+ m +','+ n +')';
			}
		},
		Plains :
		{
			sPrefix : '',
			sSuffix : '',
			sString : '',
			parse : function(c)
			{
				var text = this.text, flag = Boolean(text);
				if(flag)
				{
					if(0 <= text.indexOf("'")){
						text = text.split("'").join("\\'");
					};
					this.sString = text;
				};
			}
		},
		Plainm :
		{
			parse : function(c)
			{
				var text = this.text, flag = Boolean(text);
				this.sPrefix = c.getValue('ldelim');
				this.sSuffix = c.getValue('rdelim');

				if(flag)
				{
					if(0 <= text.indexOf("'")){
						text = text.split("'").join("\\'");
					};
					this.sString = text;
				};
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
				}
				else
				{
					var name = "'" + this.name + "'";
					var attr = this.toParameter();
					var modf = this.toModifier();

					this.sSuffix = 'function(){var buf = new Builder();\n';
					this.sString = 'self.inCall('+ name +',' + attr +','+ modf +',';
				};
			}
		},
		Function :
		{
			parse : function(c)
			{
				var m = this.toModifier();
				var p = this.toParameter();
				var n = this.quoteText( this.name );
				this.sString = 'self.inCall('+ n +','+ p +','+ m +')';
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
				}
				else
				{
					var exp = this.toExpression();
					this.sString = 'if('+ exp +'){\n';
				};
			},
			toExpression : function()
			{
				var iap = this.getValue('iap'), op = this.OPERATORS;
				var i, f, c, s = this.text.slice(this.iap).split('');

				outerloop:
				for(i=0,f=s.length;i<=f;i++)
				{
					switch(s[i])
					{
						case '$':
							s[i++] = '@@COMPILER::VARIABLE@@';
							break;
						case '"':
						case "'":
							c = s[i++];
							while(s[i] != c && i <= f) ++i;
							if(f + 1 < i) throw new Error("");
							if(s[i-1] == '\\') i--;
							break;
						case ' ':
							c = '';
							while(s[++i] != ' ' && i <= f) c += s[i], s[i] = '';
							if(f + 1 < i) throw new Error("");
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
			sString : '}else{\n'
		},
		Literal :
		{
			sPrefix : '',
			sSuffix : '',
			sString : '\'));\n',
			parse : function(c)
			{
				c.addElement('plain','literal');

				if(!this.isTerminal())
				{
					var m = this.toModifier();
					this.sPrefix = 'buf.append(';
					this.sString = 'self.inModify(' + m + ',' + "'";
				};
			}
		},
		Foreach :
		{
			parse : function(c)
			{
				if(this.isTerminal())
				{
					this.sPrefix = '';
					this.sString = 'return buf.toString();})';
				}
				else
				{
					var p = this.toParameter();
					var m = this.toModifier();

					this.sSuffix = 'function(){var buf = new Builder();\n';
					this.sString = 'self.inForeach('+ p +','+ m +',';
				};
			}
		},
		Foreachelse :
		{
			sPrefix : '',
			sSuffix : '',
			sString : 'return buf.toString();},function(){var buf = new Builder();\n'
		},
		Section :
		{
			parse : function(c)
			{
				if(this.isTerminal())
				{
					this.sPrefix = '';
					this.sString = 'return buf.toString();})';
				}
				else
				{
					var attr = this.toParameter();
					var modf = this.toModifier();
					var name = this.extract(attr, 'name').slice(1,-1);

					this.sSuffix = 'function('+ name +'){var buf = new Builder();\n';
					this.sString = 'self.inSection('+ attr +','+ modf +',';
				};
			},
			extract : function(s, k)
			{
				var r = s.match(RegExp(k + ':([^,}]+)'));
				return (r) ? r[1] : '';
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
			parse : function(c)
			{
				var exp = this.toExpression();
				this.sString = '}else if('+ exp +'){\n';
			}
		}
	}
);

JSmarty.Compiler.Sectionelse = JSmarty.Compiler.Foreachelse;