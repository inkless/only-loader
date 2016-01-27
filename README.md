Only Loader
===========

[![Build Status](https://api.travis-ci.org/inkless/only-loader.svg?branch=master)](http://travis-ci.org/inkless/only-loader)
[![Dependency Status](https://david-dm.org/inkless/only-loader.svg)](https://david-dm.org/inkless/only-loader)
[![devDependency Status](https://david-dm.org/inkless/only-loader/dev-status.svg)](https://david-dm.org/inkless/only-loader#dev-badge-embed=&info=devDependencies&view=table)

The only loader you'll need to load scripts.

#### Usage
It's damn easy to use:
```javascript
Loader(scripts, async);
```
`scripts`: The scripts you want to load, it can be array or string (split by comma)
`async`: Executes the codes asynchronously or not (in order)

#### Example

```javascript
Loader(['a.js', 'b.js']); // Load codes asynchronously but executes in order
Loader('a.js,b.js', true); // Load codes asynchronously and executes as soon as possible
Loader(['a.js', 'b.js', function() {
  // do something after a, b
}, 'c.js', 'd.js']); // Load a and b, then execute the function, then load c and d
```

Just try it!


#### Development
```bash
npm install
npm run compress
```
