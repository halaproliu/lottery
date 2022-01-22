const mongoose = require('mongoose')
const baseModel = require('./baseModel')
const Schema = mongoose.Schema

delete mongoose.connection.models['Prize']

let PrizeSchema = new Schema({
  id: Number,
  title: String,
  img: String,
  type: Number,
  count: Number,
  eachCount: Number,
  createAt: {
    type: Date,
    default: Date.now
  },
  updateAt: {
    type: Date,
    default: Date.now
  }
}, {
  versionKey: false,
  timestamps: { createdAt: 'createAt', updatedAt: 'updateAt' }
})

let Prize = mongoose.model('Prize', PrizeSchema)

PrizeSchema.plugin(baseModel)

module.exports = Prize
