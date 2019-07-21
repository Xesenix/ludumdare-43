const chalk = require('chalk');
const path = require('path');

const { application, webpack } = require('xes-webpack-core');
const webpackBase = require('webpack');
const WebpackPwaManifestPlugin = require('webpack-pwa-manifest');
const WorkboxPlugin = require('workbox-webpack-plugin');

module.exports = (config) => {
	const packageConfig = application.getPackageConfig();
	const appConfig = application.extractAppConfig();

	console.log(chalk.bold.yellow('Setting WEBPACK for game...'));
	config.module.rules.push(...webpack.loaders.shaderRulesFactory());

	console.log(chalk.bold.yellow('Adding Phaser 3 environment setup...'));
	config.plugins.push(
		new webpackBase.DefinePlugin({
			// required by Phaser 3
			CANVAS_RENDERER: JSON.stringify(true),
			WEBGL_RENDERER: JSON.stringify(true),
		}),
	);

	if (process.env.SERVICE_WORKER === 'true') {
		console.log(chalk.bold.yellow('Adding Service Worker...'));
		config.plugins = [
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
			...config.plugins,
		];
	}

	// config.devServer.disableHostCheck = true;

	// config.devtool = 'cheap-module-source-map';

	return config;
};
