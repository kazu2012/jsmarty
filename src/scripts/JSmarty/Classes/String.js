JSmarty.Classes.String = JSmarty.Classes.create(null);
JSmarty.Classes.String.prototype =
{
	initialize : function(value){ this.value = value; },
	toString : function(){
		return this.value;
	}
};
