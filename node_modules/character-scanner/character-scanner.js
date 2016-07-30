var Emitter = require('extended-emitter');

var ScanBuffer = function(options){
    if(!options) options ={};
    this.buffer = [];
    this.largestInterval = 0;
    this.times = [];
    this.scanners = {};
    this.intervals = {};
    (new Emitter()).onto(this);
};

ScanBuffer.prototype.addScanner = function(options){
	if(typeof options == "function"){
		options = {scan:options}
	}
	var ob = this;
	if(!options.interval) options.interval = 1000;
	if(options.interval > this.largestInterval) this.largestInterval = options.interval;
	if(!this.scanners[options.interval]) this.scanners[options.interval] = [];
	var pattern = options.pattern;
	if(options.pattern && !options.scan) options.scan = function(str){
        return str.match(pattern);	
	};
	this.scanners[options.interval].push(options);
};

ScanBuffer.prototype.removeAllScanners = function(){
	var ob = this;
	Object.keys(this.intervals).forEach(function(interval){
		clearInterval()
	});
}

ScanBuffer.prototype.allScanners = function(callback){
	var ob = this;
	Object.keys(this.scanners).forEach(function(scannerInterval){
		ob.scanners[scannerInterval].forEach(function(scanner){
			callback(scanner);
		});
	});
};

ScanBuffer.prototype.removeAllScanners = function(){
	var ob = this;
	Object.keys(this.intervals).forEach(function(interval){
		clearInterval()
	});
}

ScanBuffer.prototype.scan = function(scanners){
	var terminated = false;
	var ob = this;
	var now = Date.now();
	this.allScanners(function(scanner){
		if(terminated) return;
		var buffer = ob.buffer.filter(function(item){
			return item.time + scanner.interval >= now
				&& ((!scanner.flushed) || scanner.flushed < item.time);
		}).map(function(item){ return item.value }).join('');
		var result;
		if(result = scanner.scan(buffer)){
			scanner.flushed = now;
			if(scanner.callback) scanner.callback(result);
			if(scanner.name) ob.emit(scanner.name, result)
			if(scanner.terminates) terminated = true;
		}
	});
};

ScanBuffer.prototype.input = function(value){
	var now = new Date().getTime();
	var largest = this.largestInterval;
	this.buffer = this.buffer.filter(function(item){
		return item.time + largest >= now;
	});
	this.buffer.push({
		value : value,
		time : now
	});
	this.scan();
};

module.exports = ScanBuffer;
