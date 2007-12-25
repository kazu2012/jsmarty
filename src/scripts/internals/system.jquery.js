(function($)
{
	$.fn.assign = function()
	{
		var renderer = this.$getRenderer();
		renderer.assign.apply(renderer, arguments);
	};

	$.fn.$getRenderer = function()
	{
		return this.$renderer || function(self)
		{
			self.$renderer = new JSmarty();
			return self.$renderer;
		}(this);
	};

	$.fn.processTemplate = function(resourceName)
	{
		var renderer = this.$getRenderer();
		$(this).html(renderer.fetch(resourceName));
	};

})(window.jQuery);
