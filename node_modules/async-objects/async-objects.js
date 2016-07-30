(function (root, factory){
    if (typeof define === 'function' && define.amd){
        define(['async-arrays'], factory);
    }else if (typeof exports === 'object'){
        module.exports = factory(require('async-arrays'));
    }else{
        root.AsyncObjects = factory(root.AsyncArrays);
    }
}(this, function (arrays){
    var on = function(ob){
        ob = ob || {};
        if(!ob.clone) ob.clone = function(obj){
            if(!obj) return;
            var result;
            if(obj.clone && type(obj.clone) == 'function') return obj.clone();
            else 
            switch(type(obj)){
                case 'object':
                    result = {};
                    for(var key in obj){
                        result[key] = clone(obj[key]);
                    }
                    break;
                case 'array':
                    result = obj.map(function(item){return ob.clone(item); });
                    break;
                default : result = obj;
            }
            return result;
        };

        if(!ob.forEach) ob.forEach = function(object, callback){
            Object.keys(object).forEach(function(key, index){
                callback(object[key], key);
            });
        };

        // allows you to act on each member in an array one at a time 
        // (while being able to perform asynchronous tasks internally)
        if(!ob.forEachEmission) ob.forEachEmission = function(object, callback, complete){
            arrays.forEachEmission(Object.keys(object), function(key, index, done){
                callback(object[key], key, done);
            }, complete);
        };

        //allows you to act on each member in a chain in parallel
        if(!ob.forAllEmissions) ob.forAllEmissions = function(object, callback, complete){
            arrays.forAllEmissions(Object.keys(object), function(key, index, done){
                callback(object[key], key, done);
            }, complete);
        };

        //allows you to act on each member in a pool, with a maximum number of active jobs until complete
        if(!ob.forAllEmissionsInPool) ob.forAllEmissionsInPool = function(object, poolSize, callback, complete){
            arrays.forAllEmissionsInPool(Object.keys(object), poolSize, function(key, index, done){
                callback(object[key], key, done);
            }, complete);
        };
    
        if(!ob.interleave) ob.interleave = function(data, ob){
            ob = ob.clone(ob);
            ob.forEach(data, function(item, key){
                if(type(item) == 'object' && type(ob[key]) == 'object') ob[key] = ob.interleave(item, ob[key]);
                else{
                    if((!ob[key])) ob[key] = item;
                }
            });
            return ob;
        };
        
        if(!ob.random) ob.random = function(object, callback){
            var keys = Object.keys(object);
            var randomIndex = Math.floor(Math.random()*Object.keys(object).length);
            callback(object[keys[randomIndex]], keys[randomIndex]);
        }
    
        if(!ob.merge) ob.merge = function(objOne, objTwo){
            var result = {};
            ob.forEach(objOne, function(item, key){
                result[key] = item;
            });
            ob.forEach(objTwo, function(item, key){
                if(!result[key]) result[key] = item;
            });
            return result;
        };

        if(!ob.map) ob.map = function(obj, callback, excludeUndefined){
            var result = {}
            ob.forEach(obj, function(item, index){
                var res = callback(item, index, result);
                if(excludeUndefined && res === undefined) return;
                result[index] = res;
            });
            return result;
        };

        if(!ob.filter) ob.filter = function(data, test, callback){
            var results = {};
            ob.forEach(data, function(item, key){
                if(test(key, item)) results[key] = item;
            });
            return results;
        };
        
        return ob;
    }
    
    var result = on({});
    result.on = on;
    return result;
}));