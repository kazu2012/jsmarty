JSmarty.Classes.History = JSmarty.Classes.create(JSmarty.Classes.HashMap);
JSmarty.Classes.History.extend
({
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

		return this.superclass.put.call(this, key, value);
	}
});
