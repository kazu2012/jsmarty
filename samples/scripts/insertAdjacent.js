(function()
{
	if('HTMLElement' in this){
		if('insertAdjacentHTML' in HTMLElement.prototype){return;};
	}else{
		return;
	};

	function insert(w, n)
	{
		switch(w.toUpperCase())
		{
			case 'BEFOREEND':
				this.appendChild(n);
				break;
			case 'BEFOREBEGIN':
				this.parentNode.insertBefore(n, this);
				break;
			case 'AFTERBEGIN':
				this.insertBefore(n, this.childNodes[0]);
				break;
			case 'AFTEREND':
				this.parentNode.insertBefore(n, this.nextSibling);
				break;
		};
	};

	function insertAdjacentText(w, t){
		insert.call(this, w, document.createTextNode(t || ''));
	};

	function insertAdjacentHTML(w, h)
	{
		var r = document.createRange(); r.selectNode(this);
		insert.call(this, w, r.createContextualFragment(h));
	};

	function insertAdjacentElement(w, n)
	{
		insert.call(this, w, n);
		return n;
	};

	HTMLElement.prototype.insertAdjacentText = insertAdjacentText;
	HTMLElement.prototype.insertAdjacentHTML = insertAdjacentHTML;
	HTMLElement.prototype.insertAdjacentElement = insertAdjacentElement;

})();