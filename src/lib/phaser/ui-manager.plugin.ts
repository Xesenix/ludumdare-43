import { Store } from 'redux';

import { createClassProvider } from 'lib/di';

export interface IUIState {
	mute: boolean;
	musicMuted: boolean;
	effectsMuted: boolean;
	paused: boolean;
	effectsVolume: number;
	musicVolume: number;
	volume: number;
}

// prettier-ignore
export const UIManagerPluginProvider = createClassProvider('ui-manager-plugin', [
	// prettier-ignore
	'phaser:provider()',
	'data-store:provider()',
	'debug:console',
], (
	// prettier-ignore
	Phaser,
	store: Store,
	console: Console,
) => class UIManagerPlugin extends Phaser.Plugins.BasePlugin {
	public store: Store<IUIState> = store;
	private unsubscribe: any;

	constructor(
		// prettier-ignore
		public pluginManager: Phaser.Plugins.PluginManager,
	) {
		super(pluginManager);
		if (process.env.DEBUG_PHASER === 'true') { console.log('UIManagerPlugin:constructor'); }
	}

	public start() {
		if (process.env.DEBUG_PHASER === 'true') { console.log('UIManagerPlugin:start', this); }
		this.unsubscribe = this.store.subscribe(this.syncGameWithUIState);
		this.syncGameWithUIState();
	}

	public stop() {
		if (process.env.DEBUG_PHASER === 'true') { console.log('UIManagerPlugin:stop'); }
		this.unsubscribe();
	}

	private syncGameWithUIState = () => {
		const state = this.store.getState();
		if (process.env.DEBUG_PHASER === 'true') { console.log('UIManagerPlugin:syncGameWithUIState', state); }
		this.game.sound.mute = state.mute;
		this.game.sound.volume = state.volume;

		if (state.paused) {
			/** that probably should be pause @see https://github.com/photonstorm/phaser3-docs/issues/40 */
			this.game.loop.sleep();
			this.game.sound.mute = true;
		} else {
			this.game.loop.wake();
		}
	}
});
