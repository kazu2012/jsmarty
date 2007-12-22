(function()
{
	if(window.HTMLElement)
	{
		if('insertAdjacentElement' in HTMLElement.prototype){
			return;
		};
	}
	else
	{
		if(navigator.vendor == 'Apple Computer, Inc.')
		{
			document.createElement('html');
			window.HTMLElement = { prototype : window["[[DOMElement.prototype]]"] || {}};
		}
		else
		{
			return;
		};
	};

	HTMLElement.prototype.insertAdjacentElement = function(w, n)
	{
		switch(w.toLowerCase())
		{
			case 'beforebegin':
				this.parentNode.insertBefore(n, this);
				break;
			case 'afterbegin':
				this.insertBefore(n, this.childNodes[0]);
				break;
			case 'beforeend':
				this.appendChild(n);
				break;
			case 'afterend':
				this.parentNode.insertBefore(n, this.nextSibling);
				break;
		};
		return n;
	};

	HTMLElement.prototype.insertAdjacentText = function(w, t){
		this.insertAdjacentElement(w, document.createTextNode(t || ''));
	};

	HTMLElement.prototype.insertAdjacentHTML = function(w, h)
	{
		var r = document.createRange(); r.selectNode(this);
		this.insertAdjacentElement(w, r.createContextualFragment(h));
	};

})();