importPackage( java.io );
importPackage( java.lang );

String.prototype.ucfirst = function(){
	return this.slice(0,1).toUpperCase() + this.slice(1);
};

function Rhino()
{
	// private variables
	var srcDir = '';
	var distDir = '';

	var header = '/*${header}*/';
	var footer = '/*${footer}*/';

	// set up for Java task.
	var task = project.createTask("java");
	task.setFork(true);
	task.setJar(new File("custom_rhino.jar"));

	/**
	 * setArgs function
	 * wapper for setArgs (Java#setArgs) method
	 * @param {String} s
	 */
	function setArgs(s){
		task.getCommandLine().createArgument().setLine(s);
	};

	/**
	 * execute function
	 * @param {String} p path to a file
	 */
	this.execute = function(p)
	{
		setArgs('-c '+ srcDir + '/'+ p);
		task.setOutput(new File(distDir + '/' + p));
		task.execute();
		task.clearArgs();
	};

	/**
	 * setProperty function
	 * @param {String} key
	 * @param {Object} value
	 */
	this.setProperty = function(key, value)
	{
		switch(key)
		{
			case 'header':
			case 'footer':
				eval(key + '='+ key +'.replace("${'+ key +'}", value);');
				break;
			default:
				eval(key + '= value;');
				break;
		};
	};
};

function Build(){};
Build.prototype.execute = function(){};

Build.main = function(task)
{
	task = task.ucfirst();
	if(!(task in this)){
		throw new Error('undefined');
	};
	new this[task]().execute();
};

Build.define = function(c, o)
{
	var i, p, n = c.toString().match(/^function ([^(]+)\(/)[1];
	p = c.prototype = new this;
	for(i in o){ p[i] = o[i]; };
	this[n.ucfirst()] = c;
};

Build.define
(
	function Compress()
	{
	},
	{
		execute : function()
		{
			var i, it, dir, list, rhino, project;

			rhino = new Rhino();
			rhino.setProperty('srcDir', 'lib');
			rhino.setProperty('distDir', '../Temp/JSmarty');

			it = elements.get("fileset").iterator();

			while(it.hasNext())
			{
				list = it.next();
				project = list.getProject();
				dir = list.getDirectoryScanner(project).getIncludedFiles();
				for(i in dir){ rhino.execute(dir[i]); };
			};
		}
	}
);

// call main function
Build.main(attributes.get("task"));