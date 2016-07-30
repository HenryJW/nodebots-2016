'use strict'

const five = require('johnny-five')
const board = new five.Board();
let lcd = null
let ready = false

board.on('ready', function() {
  lcd = new five.LCD({
    pins: [7, 8, 9, 10, 11, 12],
    backlight: 6,
    rows: 2,
    cols: 20
  });

  this.repl.inject({
    lcd: lcd
  })

  ready = true
})


function writeMessage(message) {
  lcd.clear()
  lcd.print(message)
}

function onReady(callback) {
  let waitForReady = setInterval(() => {
    if(ready) {
      clearInterval(waitForReady)
      callback()
    }
  }, 200)
}


module.exports = {
  writeMessage: writeMessage,
  onReady: onReady
}