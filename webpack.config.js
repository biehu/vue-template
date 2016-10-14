var webpack = require('webpack');
var path = require('path');
var HtmlWebpackPlugin = require('html-webpack-plugin');

var config = {
	entry: {
		main: './src/main.js'
	},
	output: {
		path: path.resolve(__dirname, './dist')
	},
	module: {
		loaders: [
			{test: /\.css$/, loader: 'style!css'},
			{test: /\.js$/, loader: 'babel', exclude: /node_modules/},
			{test: /\.vue$/, loader: 'vue'},
			{
				test: /\.(png|jpe?g|gif|woff2?|eot|ttf|otf)$/, 
				loader: 'url', 
			    query: {limit: 10000, name: 'img/[name].[hash:8].[ext]'}
			}
		]
	},
	resolve: {
        extensions: ['', '.js', '.vue']
    },
	vue: {
		loaders: {
			js: 'babel'
		}
	},
	babel: {
		presets: ['es2015'],
    	plugins: ['transform-runtime']
	},
	plugins: [
		new webpack.DefinePlugin({
			'process.env':{
			     NODE_ENV: JSON.stringify(process.env.NODE_ENV || 'development')
			}
		}),
		new HtmlWebpackPlugin({
			template: 'template.html',
			filename: '../index.html',
			inject: true
		})
	]
};

if (process.env.NODE_ENV === 'production') {
	var ExtractTextPlugin = require('extract-text-webpack-plugin');
	var CleanWebpackPlugin = require('clean-webpack-plugin');

	config.entry.vendor = ['vue', 'vue-resource', 'vue-router'];
	
	config.output.publicPath = './dist/';
	config.output.filename = 'js/[name].[chunkhash:8].js';
	config.output.chunkFilename = 'js/[name].[chunkhash:8].js';
	
	config.vue.loaders.css = ExtractTextPlugin.extract('css');
	
	config.plugins.push(
	    new CleanWebpackPlugin(['dist']),
	    new ExtractTextPlugin('css/style.[contenthash:8].css', {allChunks: true}),
	    new webpack.optimize.CommonsChunkPlugin('vendor', 'js/vendor.[chunkhash:8].js'),
	    new webpack.optimize.UglifyJsPlugin({
	        compress: {warnings: false}
	    }),
	    new webpack.optimize.OccurenceOrderPlugin()
	);
} else {
	var port = 5000;

	config.devtool = 'eval-source-map';
	
	config.devServer = {
	    hot: true,
	    inline: true,
	    port: port
	};
	
	config.output.publicPath = 'http://localhost:' + port + '/';
	config.output.filename = '[name].js';
	
	config.vue.loaders.css = 'vue-style-loader!css-loader';
	
	config.plugins.push(
        new webpack.HotModuleReplacementPlugin()
	);
}

module.exports = config;