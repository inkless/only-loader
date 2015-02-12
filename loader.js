/**!
 * OnlyLoader - The only loader
 * @version v0.2.1 - 2015-02-12
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
		head = document.head || document.getElementsByTagName('head')[0],
		// is modern browser
		// moder browsers has 'async' attribute
		// notice: don't use an existing script here, it's dangerous, just use the dumScript
		// cannot use dummyScript.async to test, since it can be ''
		isModern = 'async' in dummyScript,
		// IE 6-9, IE10+ doesn't have this property
		isOldIE = !!dummyScript.readyState;

	// Watch scripts load in IE
	var stateChange = function() {
		// Execute as many scripts in order as we can
		// just watch if script is loaded or complete
		// if yes, try to append it to head
		// notice: when you set src for script in IE, it will directly load the script
		// but the script will be executed only after it's appended to the dom
		while (pendingScripts[0] && (typeof pendingScripts[0] === 'function' || pendingScripts[0].async || pendingScripts[0].readyState == 'loaded' || pendingScripts[0].readyState == 'complete')) {
			// get the first script from the pending array
			var script = pendingScripts.shift();

			// if the script is just a function, execute it
			if (typeof script === 'function') {
				script();
			}
			// insert script
			else {
				// avoid future loading events from this script (eg, if src changes)
				// and IE 6 memory leak
				script.onreadystatechange = null;
				// can't just appendChild, old IE bug if element isn't closed
				head.insertBefore(script, head.firstChild);
			}
		}
	}

	// load a specific script
	var loadScript = function(src, async) {
		var load = function() {
			
			if (isModern) { // modern browsers
				var script = document.createElement('script');
				script.async = async;
				script.src = src;
				script.addEventListener("load", removeFromPending);
				head.appendChild(script);
				pendingScripts.push(script);

			} else if (isOldIE) { // IE 6-9, IE10+ doesn't have this property
				// create a script and add it to our todo pile
				var script = document.createElement('script');
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

	// remove the script from pendingScripts
	var removeFromPending = function() {
		for (var i = 0, len = pendingScripts.length; i < len; ++i) {
			if (this === pendingScripts[i]) {
				pendingScripts.splice(i, 1);
			}
		}
	};

	// load inline scripts
	// TODO
	// onScriptLoad is executed too many times
	// need to figure out a way to reduce that
	var loadInlineScript = function(func, async) {
		if (!pendingScripts.length) {
			func();
		}

		// init the pending loaded number
		var pendingLoadedNum = 0;

		// if script is loaded,
		// reduce the pendingNumber, remove it from the pendingScripts array
		var onScriptLoaded = function() {
			--pendingLoadedNum;
			removeFromPending.call(window, this);
			// if pendingLoadedNum is 0, that means, nothing need to be loaded anymore
			// just run the function
			if (pendingLoadedNum === 0) func();
		};

		// for modern browser, we add eventlistener for script loaded event
		if (isModern) {
			for (var i = 0, len = pendingScripts.length; i < len; ++i) {
				var script = pendingScripts[i];
				if (script.async) continue;

				++pendingLoadedNum;
				script.addEventListener("load", onScriptLoaded);
			}
		}
		// if IE6-9, add to pendingScripts
		else if(isOldIE) {
			pendingScripts.push(func);
		}
		// the rest cases, todo
		else {
			// TODO
		}
	};

	// Class Loader
	// if async is true, scripts will be executed as soon as it arrives
	// if async is false, scripts will be executed in order
	var Loader = function(scripts, async) {
		// if it's string, just split it
		if (typeof scripts === "string")
			scripts = scripts.split(",");

		// if the scripts is a function
		// that means its inline scripts
		// also, we assume all inline scripts require non async,
		// otherwise users can just write the scripts without calling Loader
		if (typeof scripts === "function") {
			loadInlineScript(scripts);
		}

		// load all scripts one by one
		for (var i = 0; i < scripts.length; ++i)
			loadScript(scripts[i], !!async);
	};

	// export
	window.Loader = Loader;

})();
