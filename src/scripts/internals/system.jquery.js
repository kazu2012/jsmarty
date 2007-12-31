(function($)
{
	if(typeof($) == 'undefiend'){return;};

	function render(){
		if(!!this.id){ this.innerHTML = JSmarty.getInstance().fetch('id:'+ this.id);};
	};

	$.fn.assign = function()
	{
		var renderer = JSmarty.getInstance();
		renderer.assign.apply(renderer, arguments);
		return this;
	};

	$.fn.assignByRef = function()
	{
		var renderer = JSmarty.getInstance();
		renderer.assign_by_ref.apply(renderer, arguments);
		return this;
	};

	$.fn.fetch = function(resourceName)
	{
		switch(arguments.length)
		{
			case 0:
				this.each(render);
				return this;
			case 1:
				this.html(JSmarty.getInstance().fetch(resourceName));
				return this;
		};
	};

})(window.jQuery);
