JSmarty.Compiler.Foreach = JSmarty.Classes.create(JSmarty.Compiler.Module,
{
	sSuffix : '',
	parse : function()
	{
		if(this.isTerminal())
		{
			this.sPrefix = '';
			this.sString = '};return $b.toString();}()));';
			return this;
		};

		var b = new JSmarty.Classes.Buffer();
		var p = this.toObject(this.toParams());

		b.append('(function(){var $b = new $B($);');
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

		return this;
	}
});
