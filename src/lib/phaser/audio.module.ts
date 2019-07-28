import { interfaces } from 'inversify';
import { IApplication } from 'lib/interfaces';

export default class PhaserAudioModule {
	public static register(app: IApplication) {
		// TODO: this factory returns class figure out how to correctly type this binding
		app.bind('phaser:plugins')
			.toProvider((context: interfaces.Context) => (config = { key: 'audio-manager', start: true }) =>
				import(/* webpackChunkName: "phaser-audio" */ './audio/audio-manager-plugin')
					.then(async ({ PhaserAudioManagerPluginProvider: provider }) => await provider(context)())
					.then((AudioManagerPlugin) => ({
						...config,
						plugin: AudioManagerPlugin,
					})));
	}
}
