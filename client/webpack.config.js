const path = require('path');

module.exports = {
    entry: __dirname + '/src/app.js',
    output: { 
      path: __dirname + '/build', 
      filename: 'bundle.js',
      publicPath: '/'
    },
    module: {
      rules: [
      {
        test: /\.jsx?$/,
        loader: 'babel-loader',
        exclude: /node_modules/,
        query: {
          presets: ['es2015', 'react']
        }
      },
      {
        test:   /\.css$/,
        use: [
          'style-loader',
          'css-loader',
          'postcss-loader'
        ]
      }
      ]
    }
};
