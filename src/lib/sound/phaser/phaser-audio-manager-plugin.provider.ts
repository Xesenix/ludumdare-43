import { interfaces } from 'inversify';

export type IPhaserProvider = () => Promise<any>;

export const lazyPhaserAudioManagerPluginProvider = (
	context: interfaces.Context,
) => () => import(/* webpackChunkName: "phaser-audio" */ './phaser-audio-manager-plugin')
	.then(async ({ AudioManagerPluginProvider }) => await AudioManagerPluginProvider(context)());
