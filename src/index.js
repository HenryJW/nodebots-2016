'use strict'

const mongoose = require('mongoose')

const lcd = require('./hardwareModules/lcd')
const cardReader = require('./hardwareModules/cardReader')
const auth = require('./services/auth')

const connectionString = 'mongodb://localhost:27017/nodebots'

const CardTypes = {
  id: 1,
  license: 2
}

let id = ''

mongoose.connect(connectionString, (err) => {
  if(err) return _writeError('Unable to connect to database')

  lcd.onReady(() => {
    cardReader.onInput(data => {
      let cardData = _parseCardData(data)
      if(_cardType(cardData) == CardTypes.id) {
        id = cardData
        auth.isRegistered(cardData, (err, isRegistered) => {
          if(err) return _writeError('An error occurred')
          if(!isRegistered) {
            return _writeMessage('Scan license')
          }
          _checkInOrOut(cardData)
        })
        return
      }
      _register(id, _getNameFromLicence(cardData))
    })
  })
})

function _register(cardNumber, name, callback) {
  return auth.registerCard(cardNumber, name, err => {
    if(err) return _writeError('Error registering card')
    _checkInOrOut(cardNumber)
  })
}

function _cardType(cardNumber) {
  return cardNumber.split('$').length > 1 ? CardTypes.license : CardTypes.id
}

function _checkInOrOut(cardNumber, callback) {
  auth.checkInOrOut(cardNumber, (err, checkedIn, name) => {
    if(err) return _writeError('Error checkin in/out')

    if(checkedIn) _writeMessage('Hi, ' + name)
    else _writeMessage('Bye, '+ name)
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

function _getNameFromLicence(cardData) {
  let result = cardData.split('$')[1]
  console.log(result)
  return result
}