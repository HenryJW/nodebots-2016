var onData = null

function onInput(callback) {
  onData = callback;
}  

var userID = '';
var flag = true;

process.stdin.on('keypress', function (key) {
  if (key === '\r') {
    onData(userID)
    userID = ''
    return
  }

  userID += key;
});

module.exports = {
  onInput: onInput
}