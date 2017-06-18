const ILibPlugin = require('ilib-webpack-plugin');
const ExtractTextPlugin = require('extract-text-webpack-plugin');
const autoprefixer = require('autoprefixer');
const webpack = require('webpack');

exports.modifyWebpackConfig = function (config, stage) {
	const cssModulesConf = 'css?modules&minimize&importLoaders=1';
	const cssModulesConfDev = `${cssModulesConf}&sourceMap&localIdentName=[name]---[local]---[hash:base64:5]`;

	config.loader('css', cfg => {
		cfg.exclude = /(enact\/.*|\.module)\.css$/;
		return cfg;
	});
	config.loader('less', cfg => {
		cfg.exclude = /(enact\/.*|\.module)\.less$/;
		if (stage === 'develop') {
			cfg.loaders = ['style', cssModulesConfDev, 'less'];
		} else {
			cfg.loader = ExtractTextPlugin.extract('style',
						'css?-autoprefixer&modules&importLoaders=1&localIdentName=[name]__[local]---[hash:base64:5]!postcss!less');
		}
		return cfg;
	});
	config.loader('enact-css', function (cfg) {
		cfg.test = /enact\/.*\.(c|le)ss$/;
		if (stage === 'develop') {
			cfg.loaders = ['style', cssModulesConfDev, 'less'];
		} else {
			cfg.loader = ExtractTextPlugin.extract('style',
						'css?-autoprefixer&modules&importLoaders=1&localIdentName=[name]__[local]---[hash:base64:5]!postcss!less');
		}
		return cfg;
	});
	config.merge({
		postcss: function () {
			return [
				autoprefixer({
					browsers: [
						'>1%',
						'last 4 versions',
						'Firefox ESR',
						'not ie < 9' // React doesn't support IE8 anyway
					]}
				)
			];
		}
	});
	config.plugin('ilib', ILibPlugin);
	config.plugin('ignore', () => new webpack.IgnorePlugin(/^(xor|props)$/));

	return config;
};