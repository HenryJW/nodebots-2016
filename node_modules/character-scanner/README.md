character-scanner.js
====================
This is a scanner for scanning streams of characters (like you get from keyboard or "wedge" devices). It's built to be a common basis for wedge drivers, but could also be used directly.

Usage
-----

require the library
    
    var CharacterScanner = require('character-scanner');
    
the simplest way is to just use a function to determine what we're looking for:

    var keyboardBuffer = new CharacterScanner();
    keyboardBuffer.addScanner(function(bufferString){
    	//return truthy value whether bufferString is selected
    });
    

A more explicit way is to set it with options:

    keyboardBuffer.addScanner({
    	name: 'email',
    	interval: 5000,
	    scan: function(bufferString){
	    	//return truthy value whether bufferString is selected
	    },
	    callback: function(value){
	    	//do stuff
	    }
    });
    
And if you do provide a name you can then subscribe directly to events on the object instead of, or in addition to, the callback:

	keyboardBuffer.on('email', function(value){
		//do stuff
	})

Then you just wire the input stream to the scanner, by piping in characters:

    keyboardBuffer.input(chars);

Testing
-------
Tests use mocha/should to execute the tests from root

    mocha

If you find any rough edges, please submit a bug!

Enjoy,

-Abbey Hawk Sparrow