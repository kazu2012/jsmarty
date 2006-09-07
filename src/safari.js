(function()
{
	// Object.prototype.hasOwnProperty
	if(!Object.prototype.hasOwnProperty)
	{
		Object.prototype.hasOwnProperty = function(prop){
			return (this[prop] && !this.constructor.prototype[prop]);
		};
	};
})();