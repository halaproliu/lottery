
const path = require('path')
const {
  override,
  fixBabelImports,
  addWebpackAlias
} = require('customize-cra')
const chalk = require('chalk');
const progressBarPlugin = require('progress-bar-webpack-plugin')({
    width: 60,
    format:
        `${chalk.green('build')} [ ${chalk.cyan(':bar')} ]` +
        ` ${chalk.cyan(':msg')} ${chalk.red('(:percent)')}`,
    clear: true,
});
const resolve = dir => path.join(__dirname, '.', dir)
const staticFile = 'build'

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
  fixBabelImports('import', {
    libraryName: 'antd',
    style: true,
  }),
  // addLessLoader({
  //   lessOptions: {
  //     javascriptEnabled: true
  //   }
  // }),
  addWebpackAlias({
    '@': resolve('src')
  }),
  stylus(),
  (config, dev) => {
    config.resolve.extensions = ['.js', '.jsx']
    return config
  },
  (config) => {
    // 本地开发无需要设置打包
    if (process.env.REACT_APP_ENV !== 'local') {
        config.output.path = path.join(
            path.dirname(config.output.path || '/'),
            staticFile
        );
    }
    config.plugins.push(progressBarPlugin);
    return config;
  }
)
