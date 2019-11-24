const path = require("path");
const fs = require("fs");
const webpack = require("webpack");
const CircularDependencyPlugin = require("circular-dependency-plugin");
const nodeExternals = require("webpack-node-externals");

const clientConfig = {
  mode: "none",
  entry: "./dist/js/app.js",
  output: {
    filename: "public/client.bundle.js",
    path: path.resolve(__dirname, "dist")
  },
  module: {
    rules: [
      {
        test: /\.m?(js|jsx)$/,
        exclude: /node_modules/,
        use: {
          loader: "babel-loader",
          options: {
            presets: ["@babel/preset-env"]
          }
        }
      }
    ]
  }
};

const serverConfig = {
  mode: "development",
  entry: "./src/server.js",
  target: "node",
  devtool: "source-map",
  output: {
    filename: "server.bundle.js",
    path: path.resolve(__dirname, "dist")
  },
  watch: true,
  externals: [nodeExternals()],
  node: {
    console: true,
    fs: true,
    net: "empty",
    tls: "empty"
  },
  plugins: [
    new CircularDependencyPlugin({
      // exclude detection of files based on a RegExp
      exclude: /a\.js|node_modules/,
      // include specific files based on a RegExp
      include: /dir/,
      // add errors to webpack instead of warnings
      failOnError: false,
      // allow import cycles that include an asyncronous import,
      // e.g. via import(/* webpackMode: "weak" */ './file.js')
      allowAsyncCycles: false,
      // set the current working directory for displaying module paths
      cwd: process.cwd()
    }),
    new webpack.BannerPlugin({
      banner: 'require("source-map-support").install();',
      raw: true,
      entryOnly: false
    })
  ]
};

module.exports = [clientConfig, serverConfig];
