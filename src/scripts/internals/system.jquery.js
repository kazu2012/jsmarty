(function($)
{
	if(typeof($) == 'undefiend'){return;};

	$.fn.assign = function()
	{
		var renderer = this.getRenderer();
		renderer.assign.apply(renderer, arguments);
		return this;
	};

	$.fn.assignByRef = function()
	{
		var renderer = this.getRenderer();
		renderer.assign_by_ref.apply(renderer, arguments);
		return this;
	};

	$.fn.fetch = function(resourceName)
	{
		$(this).html(this.getRenderer().fetch(resourceName));
		return this;
	};

	$.fn.getRenderer = function()
	{
		return this.$renderer || function($)
		{
			$.$renderer = new JSmarty();
			return $.$renderer;
		}(this);
	};

})(window.jQuery);
