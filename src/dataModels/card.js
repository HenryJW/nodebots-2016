/// <reference path="../../typings/index.d.ts" />

const mongoose = require('mongoose')

const cardSchema = new mongoose.Schema({
  token: { type: String, index: { unique: true } },
  checkedIn: Boolean,
  name: String,
  time: { type: Date, default: Date.now}
})

module.exports = mongoose.model('card', cardSchema)