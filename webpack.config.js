const path = require('path');
const webpack = require('webpack');
const WebpackCopyAfterBuildPlugin = require('webpack-copy-after-build-plugin');

module.exports = {
  entry: {
    main: './src/collider.js'
  },
  output: {
    filename: 'collider.js',
    path: path.resolve(__dirname, 'dist')
  },
  plugins:[
    new WebpackCopyAfterBuildPlugin({
      main: '../demo/js/collider.js'
    }),
    new webpack.optimize.UglifyJsPlugin()
  ]
};