var should = require("should");
var CharacterScanner = require('./character-scanner.js');

var inputs = {
	alphabet : 'ABCDEFGHIJKLMNOPQRSTUVWXYZ',
	email : 'Most Ill<rhymin@steal.in>'
};

describe('character-scanner', function(){
    
    it('can instantiate a scanner and consume input', function(done){
        var scanner = new CharacterScanner();
        inputs.alphabet.split('').forEach(function(c){
	        scanner.input(c);
        });
        done();
    });
    
    it('can add and recognize a pattern', function(done){
        var scanner = new CharacterScanner();
        scanner.addScanner({
	        name: 'email',
	        pattern: /[a-zA-Z0-9.+-]+@[a-zA-Z0-9.+-]+\.[A-Za-z]{2,4}/mi
        });
        scanner.on('email', function(value){
	       value.should.equal('rhymin@steal.in');
	       done();
        });
        inputs.email.split('').forEach(function(c){
	        scanner.input(c);
        });
    });
    
});