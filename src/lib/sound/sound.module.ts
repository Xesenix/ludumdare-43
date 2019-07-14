import { interfaces } from 'inversify';
import { IApplication } from 'lib/interfaces';

import { AudioBufferRepository } from './audio-buffer-repository';
import { audioLoaderProvider } from './audio-loader.provider';
import { AudioMixer } from './audio-mixer';
import { AudioMixerTrack } from './audio-mixer-track';
import { IAudioContextFactory, IAudioFileLoaderProvider, IAudioMixer, IAudioTrack } from './interfaces';
import { lazyPhaserAudioLoaderServiceProvider } from './phaser/phaser-audio-loader.provider';
import { lazyPhaserAudioManagerPluginProvider } from './phaser/phaser-audio-manager-plugin.provider';

export default class SoundModule {
	public static register(app: IApplication, phaser: boolean = true) {
		// we don't want to provide AudioContext just as value because we want to wait for it being needed
		app.bind<IAudioContextFactory>('audio-context:factory').toFactory(({ container }: interfaces.Context) => {
			if (!container.isBound('audio-context')) {
				container.bind('audio-context').toConstantValue(new AudioContext());
			}
			return container.get('audio-context');
		});

		if (phaser) {
			// TODO: this factory returns class figure out how to correctly type this binding
			app.bind('phaser:plugins').toProvider(lazyPhaserAudioManagerPluginProvider);
			app.bind<IAudioFileLoaderProvider>('audio-loader:provider').toProvider(lazyPhaserAudioLoaderServiceProvider);
		} else {
			app.bind<IAudioFileLoaderProvider>('audio-loader:provider').toProvider(audioLoaderProvider);
		}

		app.bind<AudioBufferRepository>('audio-repository')
			.to(AudioBufferRepository)
			.inSingletonScope();
		app.bind<IAudioTrack>('audio-mixer:track:master')
			.to(AudioMixerTrack)
			.inSingletonScope();
		app.bind<IAudioTrack>('audio-mixer:track:effects')
			.to(AudioMixerTrack)
			.inSingletonScope();
		app.bind<IAudioTrack>('audio-mixer:track:music')
			.to(AudioMixerTrack)
			.inSingletonScope();
		app.bind<IAudioTrack>('audio-mixer:track:dialog')
			.to(AudioMixerTrack)
			.inSingletonScope();
		app.bind<IAudioMixer>('audio-mixer')
			.to(AudioMixer)
			.inSingletonScope();
	}
}
