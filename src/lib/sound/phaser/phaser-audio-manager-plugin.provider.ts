import { interfaces } from 'inversify';

export type IPhaserProvider = () => Promise<any>;

// prettier-ignore
export const lazyPhaserAudioManagerPluginProvider = (
	// prettier-ignore
	context: interfaces.Context,
) => (config = { key: 'audio-manager', start: true }) =>
	import(/* webpackChunkName: "phaser" */ './phaser-audio-manager-plugin')
		.then(async ({ AudioManagerPluginProvider }) => await AudioManagerPluginProvider(context)())
		.then((AudioManagerPlugin) => ({
			...config,
			plugin: AudioManagerPlugin,
		}));
