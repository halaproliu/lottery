let baseModel = (schema, options) => {
  schema.pre('save', (next) => {
    next()
  })
}

module.exports = baseModel
