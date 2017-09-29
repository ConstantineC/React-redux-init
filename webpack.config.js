const bootstrapEntryPoints = require('./webpack.bootstrap.config');
const glob = require('glob');
const path = require('path');
const webpack = require('webpack');
const ExtractTextPlugin = require("extract-text-webpack-plugin");
const HtmlWebpackPlugin = require('html-webpack-plugin');
const CleanWebpackPlugin = require('clean-webpack-plugin');
const PurifyCSSPlugin = require('purifycss-webpack'); 

const isProd = process.env.NODE_ENV === 'production';

const cssProd = ExtractTextPlugin.extract({
    use: ['css-loader', 'sass-loader']
});
const cssDev = ['style-loader', 'css-loader', 'sass-loader'];

const cssConfig = isProd ? cssProd : cssDev;

const bootstrapConfig = isProd ? bootstrapEntryPoints.prod : bootstrapEntryPoints.dev;

module.exports = {
    entry: {
        app: "./src/app/index.js",
        bootstrap: bootstrapConfig
    },
    output: {
        filename: '[name].bundle.js',
        path: path.resolve(__dirname, 'dist'),
    },
    devServer: {
        contentBase: path.join(__dirname, "dist"),
        compress: true,
        port: 9000,
        hot: true,
        open: true,
        stats: "errors-only"
    },
    module: {
        rules: [
            {
                test: /\.scss$/,
                use: cssConfig
            },
            {
                test: /\.js$/, 
                exclude: /node_modules/, 
                use: {  
                    loader: 'babel-loader',
                    options: {
                        presets: ['react', 'env', "stage-2"]
                    }
                } 
            },
            {
                test: /\.(png|jpg|gif)$/,
                use: [
                    {
                        loader: 'file-loader',
                        options: {
                            name: '[name].[ext]',
                            outputPath: 'img/',
                            
                            
                        }
                    }
                ]
            
            },
            
            { 
                test: /\.(woff2?|svg)$/, 
                loader: 'url-loader?limit=10000&name=fonts/[name].[ext]' 
            },
            { 
                test: /\.(ttf|eot)$/, 
                loader: 'file-loader?name=fonts/[name].[ext]' 
            }
            
        ]       
    },
    plugins: [
        new HtmlWebpackPlugin({
            title: 'My application',
            template: './src/index.html'
        }),
        new webpack.HotModuleReplacementPlugin(),
        new ExtractTextPlugin({
            filename: "css/[name].css",  
            disable: !isProd,
            allChunks: true
        }),
        new CleanWebpackPlugin(['dist'])
    ]  
}