(function()
{
	if('HTMLElement' in window)
	{
		if('insertAdjacentHTML' in HTMLElement.prototype){
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
		else{
			return;
		};
	};

	function insert(w, n)
	{
		switch(w.toUpperCase())
		{
			case 'BEFOREBEGIN':
				this.parentNode.insertBefore(n, this);
				break;
			case 'AFTERBEGIN':
				this.insertBefore(n, this.childNodes[0]);
				break;
			case 'BEFOREEND':
				this.appendChild(n);
				break;
			case 'AFTEREND':
				this.parentNode.insertBefore(n, this.nextSibling);
				break;
		};
	};

	HTMLElement.prototype.insertAdjacentText = function(w, t){
		insert.call(this, w, document.createTextNode(t || ''));
	};

	HTMLElement.prototype.insertAdjacentHTML = function(w, h)
	{
		var r = document.createRange(); r.selectNode(this);
		insert.call(this, w, r.createContextualFragment(h));
	};

	HTMLElement.prototype.insertAdjacentElement = function(w, n){
		insert.call(this, w, n); return n;
	};

})();