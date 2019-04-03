import { createClassProvider } from 'lib/di';

import { ISoundtrackPlayer } from '../interfaces';

// prettier-ignore
export const PhaserSoundtrackManagerPluginProvider = createClassProvider('phaser-soundtrack-manager-plugin', [
	// prettier-ignore
	'phaser:provider()',
	'sound-scape:soundtrack-player',
], (
	// prettier-ignore
	Phaser,
	soundtrackPlayer: ISoundtrackPlayer,
) => class PhaserSoundtrackManagerPlugin extends Phaser.Plugins.BasePlugin {
	public soundtrackPlayer: ISoundtrackPlayer = soundtrackPlayer;

	constructor(
		// prettier-ignore
		public pluginManager: Phaser.Plugins.PluginManager,
	) {
		super(pluginManager);
		if (process.env.DEBUG_SOUND === 'true') { console.log('PhaserSoundtrackManagerPlugin:constructor'); }
	}

	public start(): void {
		if (process.env.DEBUG_SOUND === 'true') { console.log('PhaserSoundtrackManagerPlugin:start', this); }
	}

	public stop() {
		if (process.env.DEBUG_SOUND === 'true') { console.log('PhaserSoundtrackManagerPlugin:stop'); }
	}
});
