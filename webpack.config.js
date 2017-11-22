const path = require('path');
const webpack = require('webpack');

module.exports = {
  entry: './src/collider.js',
  output: {
    filename: 'collider.js',
    path: path.resolve(__dirname, 'dist')
  },
  plugins:[
    new webpack.optimize.UglifyJsPlugin()
  ]
};