const chalk = require('chalk');
const path = require('path');
const fs = require('fs');

const webpackBase = require('webpack');
const CompressionPlugin = require('compression-webpack-plugin');
const { application, webpack } = require('xes-webpack-core');

const app = application.getEnvApp();
const appWebpack = `./webpack.${app}.config.js`;

const factoryConfig = {
	useBabelrc: true,
};

const configureWebpack = (config) => {
	console.log(chalk.bold.yellow('Base WEBPACK setup'), process.env.ENV);

	config.output.filename = '[name].js';
	config.output.chunkFilename = '[name].js';

	config.plugins.push(new webpackBase.ProgressPlugin());

	if (process.env.ENV !== 'test') {
		// this option doesn't work well with tests
		// for some reason it mismatches files so karma doesn't see spec files
		config.optimization.splitChunks = {
			chunks: 'all',
		};
	}

	if (process.env.ENV === 'development') {
		config.resolve.alias = {
			'react-dom': '@hot-loader/react-dom'
		};
	} else if (process.env.ENV === 'production') {
		config.plugins.push(new CompressionPlugin());
		// if you are using moment you can reduce amount of locales here
		config.plugins.push(new webpackBase.ContextReplacementPlugin(/moment[\/\\]locale$/, /(en|pl)$/));
	}

	return config;
};

const baseConfiguration = configureWebpack(webpack.webpackConfigFactory(factoryConfig));

// load additional per application webpack configuration
if (fs.existsSync(appWebpack)) {
	module.exports = () => require(appWebpack)(baseConfiguration);
} else {
	module.exports = () => baseConfiguration;
}
