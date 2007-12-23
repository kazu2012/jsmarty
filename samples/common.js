var renderer = new JSmarty();

var Action =
{
	bind : function()
	{
		var lambda = (this[name] || JSmarty.emptyFunction);
		return function()
		{
			var smarty = new JSmarty();
			lambda(smarty);
		//	renderer.assign('action', name);
			renderer.assign('result', smarty.fetch());
			renderer.display('id:content');
		}
	}
};

$(function()
{
	var anchors = $('sidebar').getElementsByTagName('a');
	for(var i=0,f=anchors.length;i<f;i++){
		anchors[i].onclick = Action.bind(anchors[i].href);
	};
});
