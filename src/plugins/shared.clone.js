function jsmarty_shared_clone(o)
{
	function f(){};
	f.prototype = o;
	return new f();
};