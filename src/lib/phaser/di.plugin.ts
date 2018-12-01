import { Container } from 'inversify';

export const createDIPlugin = (di: Container) =>
	class DIPlugin extends Phaser.Plugins.BasePlugin {
		public di: Container = di;

		constructor(public pluginManager: Phaser.Plugins.PluginManager) {
			super(pluginManager);
			console.log('DIPlugin:constructor');
		}
		public start() {
			console.log('DIPlugin:start');
		}

		public stop() {
			console.log('DIPlugin:stop');
		}
	};
