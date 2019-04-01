import { interfaces } from 'inversify';

export const lazyPhaserSoundtrackManagerPluginProvider = (
	context: interfaces.Context,
) => () => import(/* webpackChunkName: "phaser-audio" */ './soundtrack-manager-plugin')
	.then(async ({ PhaserSoundtrackManagerPluginProvider }) => await PhaserSoundtrackManagerPluginProvider(context)());
