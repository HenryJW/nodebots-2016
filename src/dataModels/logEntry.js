const mongoose = require('mongoose')

const logEntrySchema = new mongoose.Schema({
  token: String,
  action: String,
  time: Date
})

module.exports = mongoose.model('log', logEntrySchema)