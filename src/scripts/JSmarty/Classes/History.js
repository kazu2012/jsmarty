JSmarty.Classes.History = JSmarty.Classes.create(JSmarty.Classes.HashMap,
{
	put : function(key, value)
	{
		switch(typeof(value))
		{
			case 'number':
				value = new Number(value);
				break;
			case 'string':
				value = new JSmarty.Classes.String(value);
				break;
		};

		if(!value.timestamp){
			value.timestamp = JSmarty.System.timestamp();
		};

		return this.getSuper('put').call(this, key, value);
	}
});
