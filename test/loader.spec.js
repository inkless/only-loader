beforeEach(function() {
	loaderConsole.clean();
});

describe('LoaderConsole', function() {

	it('should be able to log and get log out', function() {
		loaderConsole.log('a');
		loaderConsole.log('b');
		expect(loaderConsole.getLog()).toEqual(['a', 'b']);
	});
});

describe('LoaderTest', function() {

	it('should be able to load a file', function(done) {
		Loader('/base/test/scripts/apple.js');
		setTimeout(function() {
			expect(loaderConsole.getLog()).toEqual(['apple']);
			done();
		}, 500);
	});

	it('should be able to load a function', function() {
		Loader(function() {
			loaderConsole.log('inline function');
		});
		expect(loaderConsole.getLog()).toEqual(['inline function']);
	});

	it('should be able to load a function after a script', function(done) {
		Loader('/base/test/scripts/apple.js');
		Loader(function() {
			loaderConsole.log('inline function');
		});
		setTimeout(function() {
			expect(loaderConsole.getLog()).toEqual(['apple', 'inline function']);
			done();
		}, 500);
	});

	it('should be able to load multiple files by string sepearate by comma', function(done) {
		Loader('/base/test/scripts/apple.js,/base/test/scripts/banana.js');
		Loader(function() {
			expect(loaderConsole.getLog()).toEqual(['apple', 'banana']);
			done();
		});
	});

	it('should be able to load multiple files by array', function(done) {
		Loader(['/base/test/scripts/apple.js', '/base/test/scripts/banana.js']);
		Loader(function() {
			expect(loaderConsole.getLog()).toEqual(['apple', 'banana']);
			done();
		});
	});

	it('should be able to load files and function in order', function(done) {
		Loader([
			'/base/test/scripts/apple.js',
			'/base/test/scripts/banana.js',
			function() { loaderConsole.log('inline'); }
		]);
		Loader(function() {
			expect(loaderConsole.getLog()).toEqual(['apple', 'banana', 'inline']);
			done();
		});
	});

	it('should be able to load files and function then files in order', function(done) {
		Loader([
			'/base/test/scripts/apple.js',
			'/base/test/scripts/banana.js',
			function() { loaderConsole.log('inline'); },
			'/base/test/scripts/carrot.js',
			'/base/test/scripts/grape.js'
		]);
		Loader(function() {
			expect(loaderConsole.getLog()).toEqual(['apple', 'banana', 'inline', 'carrot', 'grape']);
			done();
		});
	});

	it('should be able to support messy usage with correct order', function(done) {
		Loader('/base/test/scripts/apple.js');
		Loader([
			function() {
				loaderConsole.log('inline');
				Loader('/base/test/scripts/banana.js');
			},
			'/base/test/scripts/carrot.js'
		]);
		Loader([
			'/base/test/scripts/grape.js',
			function() {
				loaderConsole.log('inline2');
				Loader([
					'/base/test/scripts/tomato.js',
					function() { loaderConsole.log('inline3'); }
				]);

				// call expect...
				// quite messy here...
				// the order should be
				// All first level declaration first, then if Loader is used inside some scripts
				// they'll also follow the order, not only in that file, but also across files
				Loader(function() {
					expect(loaderConsole.getLog()).toEqual(['apple', 'inline', 'carrot', 'grape', 'inline2', 'potato', 'banana', 'tomato', 'inline3']);
					done();
				});
			},
			'/base/test/scripts/potato.js'
		]);
	});

});
