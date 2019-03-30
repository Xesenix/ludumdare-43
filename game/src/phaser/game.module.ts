import { ContainerModule, interfaces } from 'inversify';

import { IPhaserGameProvider, PhaserGameProvider } from './game.provider';

// TODO: move to interfaces
export type IPhaserProvider = () => Promise<any>;

export const PhaserGameModule = () =>
	new ContainerModule((bind: interfaces.Bind, unbind: interfaces.Unbind) => {
		bind<IPhaserProvider>('phaser:provider')
			.toProvider(() => () => import(/* webpackChunkName: "phaser" */ 'phaser')
				.then(({ default: Phaser }) => Phaser));
		bind<IPhaserGameProvider>('phaser:game-provider').toProvider(PhaserGameProvider);
	});
