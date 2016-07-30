/// <reference path="../../typings/index.d.ts" />

'use strict'

const mongoose = require('mongoose')

const Card = require('../dataModels/card')
const LogEntry = require('../dataModels/logEntry')

const Actions = {
  checkedIn: 'checked in',
  checkedOut: 'checked out',
  authFailed: 'invalid card',
  registered: 'registered'
}

function checkInOrOut(token, callback) {
  Card.findOne({ token: token }, (err, card) => {
    if(err) {
      _logAction(token, Actions.authFailed)
      return callback(new Error('Unauthorized card'))
    }

    let checkedIn = !card.checkedIn
    card.checkedIn = checkedIn

    card.save(err => {
      if(err) return callback(new Error('An error occurred'))
      let action = checkedIn ? Actions.checkedIn : Actions.checkedOut
      _logAction(token, action)
      callback(null, checkedIn, card.name)
    })
  })
}

function isRegistered(token, callback) {
  Card.findOne({ token: token }, (err, card) => {
    if(err) return callback(new Error('An error occurred'))

    callback(null, !!card)
  })
}

function registerCard(token, name, callback) {
  let card = {    
    token: token,
    name: name,
    checkedIn: false
  }

  Card.create(card, err => {
    if(err && callback) return callback(new Error('Error registering card'))
    _logAction(token, Actions.registered)
    if(callback) callback()
  })
}

function _logAction(token, action, callback) {
  let logEntry = {
    token: token,
    action: action,
    time: new Date()
  }

  LogEntry.create(logEntry, (err) => {
    if(err && callback) callback(new Error('Error occurred while logging'))

    if(callback) callback()
  })
}

module.exports = {
  checkInOrOut: checkInOrOut,
  registerCard: registerCard,
  isRegistered: isRegistered
}