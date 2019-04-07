const chalk = require('chalk');
const path = require('path');
const fs = require('fs');

const DotenvWebpackPlugin = require('dotenv-webpack');
const webpackBase = require('webpack');
const WebpackPwaManifestPlugin = require('webpack-pwa-manifest')
const CompressionPlugin = require('compression-webpack-plugin');
const WorkboxPlugin = require('workbox-webpack-plugin');
const { application, webpack } = require('xes-webpack-core');

const app = application.getEnvApp();
const appWebpack = `./webpack.${app}.config.js`;

const factoryConfig = {
	useBabelrc: true,
};

const configureWebpack = (config) => {
	console.log(chalk.bold.yellow('Base WEBPACK setup'), process.env.ENV);
	const packageConfig = application.getPackageConfig();
	const appConfig = application.extractAppConfig();

	config.entry.sw = path.resolve('./game/sw.js');

	config.output.filename = '[name].js';
	config.output.chunkFilename = '[name].js';

	config.plugins.push(new webpackBase.ProgressPlugin());

	config.plugins = [
		new DotenvWebpackPlugin({ path: `.env.${process.env.ENV}`, silent: true }),
		...config.plugins,
		/**
		 * @see https://developers.google.com/web/tools/workbox/modules/workbox-webpack-plugin
		 */
		new WorkboxPlugin.GenerateSW(),
		new WebpackPwaManifestPlugin({
			background_color: appConfig.templateData.themeColor,
			description: packageConfig.description,

			icons: [
				{
					sizes: [32],
					src: path.resolve('./game/assets/icons/favicon-32x32.png'),
				},
				{
					sizes: [256, 512, 1024],
					src: path.resolve('./game/assets/thumb.png'),
				},
			],
			name: packageConfig.name,
			short_name: packageConfig.name,
			theme_color: appConfig.templateData.themeColor,
		}),
	];

	if (process.env.ENV !== 'test') {
		// this option doesn't work well with tests
		// for some reason it mismatches files so karma doesn't see spec files
		config.optimization.splitChunks = {
			chunks: 'all',
		};
	}

	if (process.env.CHECK_TYPESCRIPT) {
		config.module.rules[3] = {
			test: /\.tsx?$/,
			use: 'ts-loader',
			exclude: /node_modules/,
		};
	}

	if (process.env.ENV === 'development') {
		config.resolve.alias = {
			'react-dom': '@hot-loader/react-dom',
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
