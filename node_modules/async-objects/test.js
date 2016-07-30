var should = require("should");
require('./async-objects').on(Object);

var object = {
    aKey : 'some value',
    anotherKey : 'some other value',
    oneMoreKey : 'yet more'
}

var anotherObject = {
    someKey : 'a value'
}

var poolSize = 2;

describe('async-objects', function(){
    
    describe('uses forEachEmission', function(){
        
        it('to only perform one action at a time', function(complete){
            var count = 0;
            Object.forEachEmission(object, function(key, value, done){
                count++;
                count.should.equal(1);
                setTimeout(function(){
                    count--;
                    done();
                }, 50);
            }, function(){
                count.should.equal(0);
                complete();
            });
        });
    
    });
    
    describe('uses forAllEmissions', function(){
        
        it('to perform all actions in parallel', function(complete){
            var count = 0;
            var lastCount = 0;
            Object.forAllEmissions(object, function(key, value, done){
                count++;
                count.should.be.above(lastCount);
                lastCount = count;
                setTimeout(function(){
                    count--;
                    done();
                }, 50);
            }, function(){
                count.should.equal(0);
                complete();
            });
        });
    
    });
    
    describe('uses forAllEmissionsInPool', function(){
        
        it('to perform N actions in parallel', function(complete){
            var count = 0;
            Object.forAllEmissionsInPool(object, poolSize, function(key, value, done){
                count++;
                count.should.be.above(0);
                count.should.be.below(poolSize+1);
                setTimeout(function(){
                    count--;
                    done();
                }, 50);
            }, function(){
                count.should.equal(0);
                complete();
            });
        });
    
    });
    
    describe('uses merge', function(){
        
        it('to combine two objects', function(complete){
            var count = 0;
            var combined = Object.merge(object, anotherObject);
            should.exist(combined.aKey);
            should.exist(combined.anotherKey);
            should.exist(combined.oneMoreKey);
            should.exist(combined.someKey);
            complete();
        });
    
    });
});