
const path = require('path')
const {
  override,
  addWebpackAlias
} = require('customize-cra')
const resolve = dir => path.join(__dirname, '.', dir)

const stylus = () => config => {
  const stylusLoader = {
    test: /\.styl$/,
    use: [
      {
        loader: 'style-loader'
      }, {
        loader: 'css-loader',
      }, {
        loader: 'stylus-loader'
      }
    ]
  }
  const oneOf = config.module.rules.find(rule => rule.oneOf).oneOf
  oneOf.unshift(stylusLoader)
  return config
}

module.exports = override(
  addWebpackAlias({
    '@': resolve('src')
  }),
  stylus(),
  (config, dev) => {
    config.resolve.extensions = ['.js', '.jsx']
    return config
  }
)