JSmarty.Compiler.Section = JSmarty.Classes.create(JSmarty.Compiler.Module,
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
		var e, k = p.name || 'i';

		var buf = JSmarty.Classes('Buffer');
		var exp = JSmarty.Classes('Buffer');

		exp.append(k, '=', p.start || 0);
		exp.append(k, '<=', p.max || isNaN(Number(p.loop)) ? p.loop + '.length-1' : p.loop);
		exp.append(k, '+=', p.step || 1);

		buf.append
		(
			'$.$m(', this.toModify(), ',',
			'function(){var ', k,', $b = $C("Buffer");'
		);
		buf.appendIf(p.name)
		(
			'$.$section.', p.name,'={total:0,index:-1,iteration:0};',
			'var $l=$.$section.', p.name,';',
			'$l.first=true,$l.last=false;',
			'for(', exp.toString(';') ,'){$l.total++;};'
		);
		buf.append('for(', exp.toString(';'), '){');
		buf.appendIf(p.name)
		(
			'$l.index++, $l.rownum = $l.iteration++;',
			'$l.first=($l.index==0), $l.last=($l.iteration==$l.total);'
		);

		this.sString = buf.toString('\n');
	}
});
