'use strict'

const mongoose = require('mongoose')

const lcd = require('./hardwareModules/lcd')
const cardReader = require('./hardwareModules/cardReader')
const auth = require('./services/auth')

mongoose.connect('mongodb://localhost:27017/nodebots', (err) => {
  if(err) return _writeError('Unable to connect to database')

  lcd.onReady(() => {
    cardReader.onInput(data => {
      let cardNumber = _parseCardData(data)
      auth.isRegistered(cardNumber, (err, isRegistered) => {
        if(err) return _writeError('An error occurred')
        if(!isRegistered) {
          return auth.registerCard(cardNumber, err => {
            if(err) return _writeError('Error registering card')
            _checkInOrOut(cardNumber)
          })
        }
        _checkInOrOut(cardNumber)
      })
    })
  })
})

function _checkInOrOut(cardNumber, callback) {
  auth.checkInOrOut(cardNumber, (err, checkedIn) => {
    if(err) return _writeError('Error checkin in/out')

    if(checkedIn) _writeMessage('Checked in')
    else _writeMessage('Checked out')
  })
}

function _writeError(message) {
  lcd.writeMessage('ERROR: ' + message)
}

function _writeMessage(message) {
  lcd.writeMessage(message)
}

function _parseCardData(data) {
  return data.slice(1, data.length - 1)
}