/**
 * OnlyLoader - The only loader
 * @version v0.1 - 2014-01-16
 * @author Guangda Zhang
 * @link https://github.com/inkless/only-loader
 * @license MIT License, http://www.opensource.org/licenses/MIT
 */
;(function() {

	"use strict";

	var // maintain all scripts need to be loaded here,
		// some time ppl may use our loader several times in the whole page,
		// and they hope the latter one is still dependant to the previous one,
		// so we need to maintain all these into the same array
		pendingScripts = [],
		// just for test features
		dummyScript = document.createElement('script'),
		// find the document.head
		head = document.head || document.getElementsByTagName('head')[0];

	// Watch scripts load in IE
	var stateChange = function() {
		// Execute as many scripts in order as we can
		// just watch if script is loaded or complete
		// if yes, try to append it to head
		// notice: when you set src for script in IE, it will directly load the script
		// but the script will be executed only after it's appended to the dom
		while (pendingScripts[0] && (pendingScripts[0].async || pendingScripts[0].readyState == 'loaded' || pendingScripts[0].readyState == 'complete')) {
			// get the first script from the pending array
			var script = pendingScripts.shift();
			// avoid future loading events from this script (eg, if src changes)
			// and IE 6 memory leak
			script.onreadystatechange = null;
			// can't just appendChild, old IE bug if element isn't closed
			head.insertBefore(script, head.firstChild);
		}
	}

	// load a specific script
	var loadScript = function(src, async) {
		var load = function() {
			// moder browsers has 'async' attribute
			// notice: don't use an existing script here, it's dangerous, just use the dumScript
			// cannot use dummyScript.async to test, since it can be ''
			if ('async' in dummyScript) { // modern browsers
				var script = document.createElement('script');
				script.type = "text/javascript";
				script.async = async;
				script.src = src;
				head.appendChild(script);
			} else if (dummyScript.readyState) { // IE 6-9, IE10+ doesn't have this property
				// create a script and add it to our todo pile
				var script = document.createElement('script');
				script.type = "text/javascript";
				// just try to save async, this won't effect browser
				// we'll use it when stateChange
				script.async = async;
				pendingScripts.push(script);
				// listen for state changes
				script.onreadystatechange = stateChange;
				// must set src AFTER adding onreadystatechange listener
				// else we’ll miss the loaded event for cached scripts
				script.src = src;
			} else { // fall back to defer, not sure which browsers are, maybe IE4? old ff and opera.
				document.write('<script src="' + src + '" defer></' + 'script>');
			}
		};

		// well, this is a tricky bug
		// without setTimeout, the execution order sucks, we have to add the setTimeout to keep it in order
		// basically IE 11 and IE 10 in surface app has the problem
		// and maybe some old browsers
		if (document.documentMode && document.documentMode > 9)
			setTimeout(load, 0);
		else
			load();
	};

	// out loader class
	var Loader = function(scripts, async) {
		// if it's string, just split it
		if (typeof scripts === "string")
			scripts = scripts.split(",");

		if (!Object.prototype.toString.apply(scripts).toLowerCase() === '[object array]') return;
		// load all scripts one by one
		for (var i = 0; i < scripts.length; ++i)
			loadScript(scripts[i], async);
	};

	// export
	this.Loader = Loader;

}).call(this);
