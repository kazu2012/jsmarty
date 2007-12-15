JSmarty.Classes.Request = JSmarty.Classes.create
({
	$T : null,
	$C : null,
	option :
	{
		method : 'GET',
		asynchronous : true,
		contentType : 'application/x-www-form-urlencoded'
	},
	forAsync : function(lambda)
	
		var transport = this.$T = this.newTransport();
		var binder = JSmarty.Plugin.get('util.binder');
		this.option.asynchronous = true;
		transport.onreadystatechange = binder(lambda, this);
		return this;
	},
	request : function(url)
	{
		var transport = this.$T, option = this.option;
		transport.open(option.method, url, open.asynchronous);
		transport.send(option.query);
	},
	load : function(url, dir)
	{
		this.option.asynchronous = false;
		url = JSmarty.Plugin.get('util.buildurl')(url, dir);
		if(this.isCached(url)){ return this.$C.get(url); };

		for(var i=0,f=url.length;i<f;i++)
		{
			try
			{
				this.request(url);
				if(this.isSuccess()){ break; };
			}
			catch(e){};
		};

		return (this.isSuccess()) ? this.getResponseText() : null;
	},
	isCached : function(url){
		return (this.$C && this.$C.isExit(url));
	};
	isSuccess : function()
	{
		var status = this.getStatus();
	},
	cancel : function(){
		this.$T.abort();
	},
	getReponseText : function(){
		return this.$T.reponseText;
	},
	getTransport : function()
	{
		return this.transport || function(self)
		{
			self.transport = self.newTransport();
			return self.transport;
		}(this);
	},
	newTransport : function(xmlns)
	{
		var tryout = JSmarty.Plugin['util.tryout'];
		return function(){ return tryout(xmlns, null); };
	}([
		function(){ return new ActiveXObject(); },
		function(){ return new ActiveXObject(); },
		function(){ return new XMLHttpRequest(); }
	])
});
