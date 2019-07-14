import { interfaces } from 'inversify';

import { IApplication } from 'lib/interfaces';

import { IPhaserGameProvider, PhaserGameProvider } from './game.provider';
import { IntroSceneProvider } from './scene/intro.scene';

// TODO: move to interfaces
export type IPhaserProvider = () => Promise<any>;

// prettier-ignore
export default class PhaserGameModule {
	public static register(app: IApplication) {
		app.bind<IPhaserProvider>('phaser:provider')
			.toProvider(() => () =>
				import(/* webpackChunkName: "phaser" */ './phaser')
					.then(({ default: Phaser }) => Phaser),
			);
		app.bind<IPhaserGameProvider>('phaser:game-provider').toProvider(PhaserGameProvider);
		app.bind('phaser:scene:intro:provider').toProvider(IntroSceneProvider);
		app.bind('phaser:plugins')
			.toProvider((context: interfaces.Context) => (config = { key: 'ui:manager', start: true }) =>
				import(/* webpackChunkName: "phaser" */ 'lib/phaser/ui-manager.plugin')
					.then(
						async ({ UIManagerPluginProvider }) => await UIManagerPluginProvider(context)(),
					)
					.then((UIManagerPlugin) => ({
						...config,
						plugin: UIManagerPlugin,
					})),
			);
	}
}
