function jsmarty_shared_clone(o)
{
	function f(){};
	f.prototype = f;
	return new f();
};