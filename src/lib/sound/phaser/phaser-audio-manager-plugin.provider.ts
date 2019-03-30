import { interfaces } from 'inversify';
import { Store } from 'redux';

import { AudioMixer } from '../audio-mixer';
import {
	// prettier-ignore
	IAudioBufferRepository,
	IAudioConfigurationState,
	IAudioContextFactory,
	IAudioFileLoaderProvider,
} from '../interfaces';

import { phaserAudioManagerPluginFactory } from './phaser-audio-manager.plugin';

export type IPhaserProvider = () => Promise<any>;

export const phaserAudioManagerPluginProvider = <T extends IAudioConfigurationState>(
	context: interfaces.Context,
) => () => Promise.all([
	// prettier-ignore
	context.container.get<IPhaserProvider>('phaser:provider')(),
	context.container.get<IAudioFileLoaderProvider>('audio-loader:provider')(),
]).then(([
	// prettier-ignore
	Phaser,
	audioLoader,
]) => phaserAudioManagerPluginFactory<T>(
	Phaser,
	context.container.get<Store<T>>('data-store'),
	context.container.get<IAudioContextFactory>('audio-context:factory'),
	context.container.get<AudioMixer>('audio-mixer'),
	context.container.get<IAudioBufferRepository>('audio-repository'),
	audioLoader,
));
