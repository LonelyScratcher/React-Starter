const webpack = require('webpack');
const merge = require("webpack-merge");

const HtmlWebpackPlugin = require('html-webpack-plugin');
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const CopyWebpackPlugin = require('copy-webpack-plugin');
const path = require("path"); // Add this in top

const APP_DIR = path.resolve(__dirname, '../src'); // <===== new stuff added here

module.exports = env => {
    const { PLATFORM, VERSION } = env;
    return merge([
        {
            entry: ['@babel/polyfill', APP_DIR], // <===== new stuff added here
            resolve: {
                alias: {
                    '@': path.resolve(__dirname,'../src'),
                }
            },
            devtool: 'inline-source-map',
            // devServer: {
            //     contentBase: './',
            // },
            module: {
                rules: [
                    {
                        test: /\.js$/,
                        exclude: /node_modules/,
                        use: {
                            loader: 'babel-loader'
                        }
                    },
                    {
                        test: /\.scss$/,
                        use: [
                            PLATFORM === 'production' ? MiniCssExtractPlugin.loader : 'style-loader',
                            'css-loader',
                            'sass-loader'
                        ]
                    }
                ]
            },
            plugins: [
                new CopyWebpackPlugin([ { from: 'src/static' } ]),
                new HtmlWebpackPlugin({
                    template: './src/index.html',
                    filename: './index.html'
                }),
                new webpack.DefinePlugin({
                    'process.env.VERSION': JSON.stringify(env.VERSION),
                    'process.env.PLATFORM': JSON.stringify(env.PLATFORM)
                }),
            ],
        }
    ])
};
