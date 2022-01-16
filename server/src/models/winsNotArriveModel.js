const mongoose = require('mongoose')
const baseModel = require('./baseModel')
const Schema = mongoose.Schema

delete mongoose.connection.models['WinNotArrive']

let WinNotArriveSchema = new Schema({
  id: String,
  code: Number,
  username: String,
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

let WinNotArrive = mongoose.model('WinNotArrive', WinNotArriveSchema)

WinNotArriveSchema.plugin(baseModel)

module.exports = mongoose.models.WinNotArrive ? mongoose.models.WinNotArrive : WinNotArrive
