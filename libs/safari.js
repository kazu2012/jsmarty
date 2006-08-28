(function()
{
	// Object.hasOwnProperty
	if(!Object.hasOwnProperty)
	{
		Object.hasOwnProperty = function(prop){
			return (this[prop] && !this.constructor.prototype[prop]);
		};
	};

	// String.prototype.replace
	var Temp = String.prototype.replace;
})();