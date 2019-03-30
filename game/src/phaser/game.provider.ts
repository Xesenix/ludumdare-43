import { interfaces } from 'inversify';
import { Store } from 'redux';

import { IDataStoreProvider } from 'lib/data-store';
import { IAudioManagerPlugin } from 'lib/sound';

import { IPhaserProvider } from './game.module';

export type IPhaserGameProvider = (forceNew?: boolean) => Promise<Phaser.Game>;

// singleton
let game: Phaser.Game | null = null;

export function PhaserGameProvider(context: interfaces.Context) {
	const console: Console = context.container.get<Console>('debug:console');
	const eventManager: Console = context.container.get<Console>('event-manager');
	console.debug('PhaserGameProvider');

	return (forceNew: boolean = false): Promise<Phaser.Game> => {
		const parent = context.container.get<HTMLElement>('phaser:container');
		const storeProvider = context.container.get<IDataStoreProvider<any, any>>('data-store:provider');
		const phaserProvider = context.container.get<IPhaserProvider>('phaser:provider');
		console.debug('PhaserGameProvider:provide', parent, storeProvider);

		// preload phaser module that is needed by subsequential modules
		// TODO: convert to observable so it can return progress on loading
		return phaserProvider().then((Phaser) => Promise.all([
				// prettier-ignore
				import('lib/phaser/ui-manager.plugin'),
				import('./scene/intro.scene'),
				context.container.get<interfaces.Factory<IAudioManagerPlugin<any>>>('audio-manager-plugin:provider')(),
				context.container.get<interfaces.Factory<Phaser.Plugins.BasePlugin>>('soundtrack-manager-plugin:provider')(),
			]).then(([
				// prettier-ignore
				{ createUIManagerPlugin },
				{ phaserIntroSceneFactory },
				AudioManagerPluginClass,
				SoundtrackManagerPluginClass,
			]) => storeProvider().then((store: Store) => {
				if (!forceNew && game !== null) {
					console.debug('PhaserGameProvider:swap parent', game);
					parent.appendChild(game.canvas);

					return Promise.resolve(game);
				}

				const backgroundColor = 0x000000;

				/** @see https://github.com/photonstorm/phaser/blob/master/src/boot/Config.js */
				const fps: FPSConfig = {
					min: 10,
					target: 30,
					forceSetTimeOut: false,
					deltaHistory: 10,
					panicMax: 120,
				};

				const loader: LoaderConfig = {};

				const render: RendererConfig = {
					resolution: 1,
					antialias: false,
					autoResize: true,
					backgroundColor,
					pixelArt: true, // => antialias: false, roundPixels: true
					roundPixels: true,
					transparent: false,
					clearBeforeRender: false,
					premultipliedAlpha: true,
					preserveDrawingBuffer: false,
					failIfMajorPerformanceCaveat: false,
					powerPreference: 'default', // 'high-performance', 'low-power' or 'default'
				};

				const config: GameConfig = {
					audio: {
						noAudio: true,
					},
					width: 768,
					height: 300,
					type: Phaser.CANVAS, // AUTO, CANVAS, WEBGL, HEADLESS
					parent,
					disableContextMenu: true,
					fps,
					render,
					backgroundColor,
					callbacks: {
						preBoot: (x) => {
							console.log('=== PRE BOOT', x);
						},
						postBoot: (x) => {
							console.log('=== POST BOOT', x);
						},
					},
					loader,
					images: {
						// default: '',
						// missing: '',
					},
					plugins: {
						global: [
							{
								key: 'ui:manager',
								plugin: createUIManagerPlugin(Phaser, store),
								start: true,
							},
							{
								key: 'audio-manager',
								plugin: AudioManagerPluginClass,
								start: true,
							},
							{
								key: 'soundtrack-manager',
								plugin: SoundtrackManagerPluginClass,
								start: true,
							},
						],
					},
					scene: [phaserIntroSceneFactory(Phaser, eventManager)],
				};

				game = new Phaser.Game(config);

				try {
					console.debug('PhaserGameProvider:game', game);

					return Promise.resolve(game as Phaser.Game);
				} catch (error) {
					console.debug('PhaserGameProvider:error', parent, error);
					return Promise.reject(error);
				}
			}),
		));
	};
}
