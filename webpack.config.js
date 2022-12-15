// Core Stuff
const path = require('path');

// Config
const config = {
  entry: './main.js',
  mode: 'none',
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: 'FreeExecutor.js'
  },
};

module.exports = config;