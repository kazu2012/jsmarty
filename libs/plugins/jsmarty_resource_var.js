jsmarty_resource_var =
{
	source:function(name, template, smarty)
	{
		template[name] = name;
		return true;
	},
	timestamp:function(){},
	secure:function(){ return true; },
	trusted:function(){}
};