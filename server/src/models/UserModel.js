const mongoose = require('mongoose')
const baseModel = require('./baseModel')
const Schema = mongoose.Schema
const Models = mongoose.Models

delete mongoose.connection.models['User']

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
}, {
  versionKey: false,
  timestamps: { createdAt: 'createAt', updatedAt: 'updateAt' }
})

let User = mongoose.model('User', UserSchema)

UserSchema.plugin(baseModel)

module.exports = User
