JSmarty.Classes.String = JSmarty.Classes.create(null);
JSmarty.Classes.String.prototype =
{
	init : function(value){
		this.toString = functuion(){ return value; };
	}
};
