const mongoose = require('mongoose')
const baseModel = require('./baseModel')
const Schema = mongoose.Schema

let WinSchema = new Schema({
  id: String,
  code: Number,
  username: String,
  nickName: String,
  prizeName: String,
  type: Number,
  subType: Number,
  createAt: {
    type: Date,
    default: Date.now()
  },
  updateAt: {
    type: Date,
    default: Date.now()
  }
})

let Win = mongoose.model('Win', WinSchema)

WinSchema.plugin(baseModel)

module.exports = Win
