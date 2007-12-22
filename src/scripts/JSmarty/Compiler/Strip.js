JSmarty.Compiler.Strip = JSmarty.Classes.create(JSmarty.Compiler.Literal,
{
	sString : '\').replace(/\\n/g,\'\')));',
	parse : function(ctx)
	{
		this.getSuper('parse').call(this, ctx);
		if(!this.isTerminal()){
			this.sString += '\'+(\'';
		};
		return this;
	}
});
