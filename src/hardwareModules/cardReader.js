var onData = null

function onInput(callback) {
  //FIXME: Quick hack since this function is only called once :P
  onData = callback;
}  

var userID = '';

// FIXME: Should to use built-in readline module instead
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