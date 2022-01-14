const mongoose = require('mongoose')
const baseModel = require('./baseModel')
const Schema = mongoose.Schema

let UserSchema = new Schema({
  id: String,
  code: Number,
  username: String,
  nickName: String,
  createAt: {
    type: Date,
    default: Date.now()
  },
  updateAt: {
    type: Date,
    default: Date.now()
  }
})

let User = mongoose.model('User', UserSchema)

UserSchema.plugin(baseModel)

module.exports = User
