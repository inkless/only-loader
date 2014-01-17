/**
 * OnlyLoader - The only loader
 * @version v0.1 - 2014-01-16
 * @author Guangda Zhang
 * @link https://github.com/inkless/only-loader
 * @license MIT License, http://www.opensource.org/licenses/MIT
 */
;(function() {

	var // whether we need to execute it as async or in order, default as false (execute in order)
		_async = false,
		// maintain all scripts need to be loaded here, 
		// some time ppl may use our loader several times in the whole page,
		// and they hope the latter one is still dependant to the previous one,
		// so we need to maintain all these into the same array
		_pendingScripts = [],
		// just for test features
		_dumbScript = document.createElement('script'),
		// find the document.head
		head = document.head || document.getElementsByTagName('head')[0];

	// Watch scripts load in IE
	var stateChange = function() {
		// Execute as many scripts in order as we can
		// just watch if script is loaded or complete
		// if yes, try to append it to head
		// notice: when you set src for script in IE, it will directly load the script
		// but the script will be executed only after it's appended to the dom
		while (_pendingScripts[0] && (_async || _pendingScripts[0].readyState == 'loaded' || _pendingScripts[0].readyState == 'complete')) {
			// get the first script from the pending array
			var script = _pendingScripts.shift();
			// avoid future loading events from this script (eg, if src changes)
			// and IE 6 memory leak
			script.onreadystatechange = null;
			// can't just appendChild, old IE bug if element isn't closed
			head.insertBefore(script, head.firstChild);
		}
	}

	// load a specific script
	var loadScript = function(src) {
		var _load = function() {
			// moder browsers has 'async' attribute
			// notice: don't use an existing script here, it's dangerous, just use the dumScript
			if ('async' in _dumbScript) { // modern browsers
				var script = document.createElement('script');
				script.type = "text/javascript";
				script.async = _async;
				script.src = src;
				head.appendChild(script);
			} else if (_dumbScript.readyState) { // IE<10, IE10+ doesn't have this property
				// create a script and add it to our todo pile
				var script = document.createElement('script');
				script.type = "text/javascript";
				_pendingScripts.push(script);
				// listen for state changes
				script.onreadystatechange = stateChange;
				// must set src AFTER adding onreadystatechange listener
				// else we’ll miss the loaded event for cached scripts
				script.src = src;
			} else { // fall back to defer
				document.write('<script src="' + src + '" defer></' + 'script>');
			}
		};

		// well, this is a tricky bug
		// without setTimeout, the execution order sucks, we have to add the setTimeout to keep it in order
		if (document.documentMode && document.documentMode > 10)
			setTimeout(_load, 0);
		else
			_load();
	};

	// out loader class
	var Loader = function(scripts, async) {
		// if it's string, just split it
		if (typeof scripts === "string")
			scripts = scripts.split(",");

		if (!Object.prototype.toString.apply(scripts).toLowerCase() === '[object array]') return;

		_async = !!async;

		// load all scripts one by one
		for (var i = 0; i < scripts.length; ++i) {
			loadScript(scripts[i]);
		}
	};

	// export
	this.Loader = Loader;

}).call(this);
