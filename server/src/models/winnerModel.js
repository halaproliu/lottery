const mongoose = require('mongoose')
const baseModel = require('./baseModel')
const Schema = mongoose.Schema

delete mongoose.connection.models['Winner']

let WinnerSchema = new Schema({
  id: String,
  code: Number,
  username: String,
  nickName: String,
  prizeName: String,
  type: Number,
  subType: Number,
  title: String,
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

let Winner = mongoose.model('Winner', WinnerSchema)

WinnerSchema.plugin(baseModel)

module.exports = Winner
