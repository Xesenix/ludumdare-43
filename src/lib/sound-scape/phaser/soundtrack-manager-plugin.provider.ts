import { interfaces } from 'inversify';
import { IAudioFileLoaderProvider } from 'lib/sound';

import { ISoundtrackPlayer } from '../interfaces';

import { phaserSoundtrackManagerPluginFactory } from './soundtrack-manager.plugin';

export type IPhaserProvider = () => Promise<any>;

export const phaserSoundtrackManagerPluginProvider = (context: interfaces.Context) => () =>
	Promise.all([
		// prettier-ignore
		context.container.get<IPhaserProvider>('phaser:provider')(),
		context.container.get<IAudioFileLoaderProvider>('audio-loader:provider')(),
	]).then(([Phaser]) => phaserSoundtrackManagerPluginFactory(Phaser, context.container.get<ISoundtrackPlayer>('sound-scape:soundtrack-player')));
