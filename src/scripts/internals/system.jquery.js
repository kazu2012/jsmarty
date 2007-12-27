(function($)
{
	if(typeof($) == 'undefiend'){ return; };

	$.fn.assign = function()
	{
		var renderer = this.getRenderer();
		renderer.assign.apply(renderer, arguments);
	};

	$.fn.assignByRef = function()
	{
		var renderer = this.getRenderer();
		renderer.assign_by_ref.apply(renderer, arguments);
		return this;
	};

	$.fn.dot = function(resourceName, type)
	{
		$(this)[type || 'html'](this.getRenderer().fetch(resourceName));
		return this;
	};

	$.fn.getRenderer = function()
	{
		return this.$renderer || function(self)
		{
			self.$renderer = new JSmarty();
			return self.$renderer;
		}(this);
	};

})(window.jQuery);
