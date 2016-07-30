var onData = null

function onInput(callback) {
  // setTimeout(() => callback(':00050?'), 2000)
  onData = callback;
}

var stdin = process.openStdin(); 
// require('tty').setRawMode(true);    

var userID = '';
var flag = true;

stdin.on('keypress', function (chunk, key) {
  // console.log('Get Chunk: ' + chunk + '\n');
  userID += chunk;
  
  if (key && key.ctrl && key.name == 'c') process.exit();
  if (key.name === 'return') {
    onData(userID)
    console.log('userID',userID);
  }
});

module.exports = {
  onInput: onInput
}