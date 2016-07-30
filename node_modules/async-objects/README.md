async-objects.js
===============

utility functions for Object when using that data asynchronously, ported from prime-ext

Usage
-----
I find, most of the time, my asynchronous logic emerges from a list and I really just want to be able to control the completion of some job, and have a signal for all jobs. In many instances, this winds up being more versatile than a promise which limits you to a binary state and only groups returns according to it's state. 

you can either use the functions as returned:

    var objectTool = require('async-objects');
    objectTool.forEachEmission(object, iteratorFn, callback);
    
or you can add them to `Object`

    require('async-objects').on(Object);

forEachEmission : execute serially

    Object.forEachEmission(object, function(item, index, done){
        somethingAsynchronous(function(){
            done();
        });
    }, function(){
        //we're all done!
    });
    
forAllEmissions : execute all jobs in parallel

    Object.forAllEmissions(object, function(item, index, done){
        somethingAsynchronous(function(){
            done();
        });
    }, function(){
        //we're all done!
    });
    
forAllEmissionsInPool : execute all jobs in parallel up to a maximum #, then queue for later

    Object.forAllEmissionsInPool(object, poolSize, function(item, index, done){
        somethingAsynchronous(function(){
            done();
        });
    }, function(){
        //we're all done!
    });
    
a cloner for recursively copying any object/array
    
    var copy = Object.clone(object);
    
a non-referencing interleaver(it clones as it interleaves)

    var combined = Object.interleave(object, anotherObject);
    
a shallow object merge
    
    var combined = Object.merge(objOne, objTwo);

a map, to process all object values

    var mappedObject = Object.map(object, mapFn[, excludeUndefinedValues]);

a filter to reduce the fields in an object

    var filteredObject = Object.filter(object, testFn);
    


That's just about it, and even better you can open up the source and check it out yourself. Super simple.

Testing
-------
just run
    
    mocha

Enjoy,

-Abbey Hawk Sparrow