Only Loader
===========

The only loader you'll need to load scripts.

####Usage####
It's dame easy to use:
```javascript
Loader(scripts, async);
```
`scripts`: The scripts you want to load, it can be array or string (split by common)
`async`: Executes the codes asynchronously or not (in order)

####Example####

```javascript
Loader(['a.js', 'b.js']); // Load codes asynchronously but executes in order
Loader('a.js,b.js', true); // Load codes asynchronously and executes as soon as possible
```

Just try it!
