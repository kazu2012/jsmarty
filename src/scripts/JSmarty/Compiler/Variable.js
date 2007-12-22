JSmarty.Compiler.Variable = JSmarty.Classes.create(JSmarty.Compiler.Module,
{
	parse : function(c)
	{
		var m = this.toModify();
		var n = JSmarty.Compiler.VALSYMBL + this.get('name');
		this.sString = '$.$m('+ m +','+ n +')';

		return this;
	}
});