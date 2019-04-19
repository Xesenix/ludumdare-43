import * as React from 'react';
import * as ReactDOM from 'react-dom';

import { EventEmitter } from 'eventemitter3';
import { Container } from 'inversify';

import { Game } from 'game/game';
import { DataStore, IGameState } from 'game/store';
import { DataStoreModule } from 'lib/data-store';
import { DebugModule } from 'lib/debug';
import { DIContext } from 'lib/di';
import { FullScreenModule } from 'lib/fullscreen';
import { defaultI18nState, I18nModule, i18nReducer, II18nState } from 'lib/i18n';
import { IApplication, IEventEmitter, IValueAction } from 'lib/interfaces';
import { ServiceWorkerModule } from 'lib/service-worker';
import { SoundModule } from 'lib/sound';
import { SoundScapeModule } from 'lib/sound-scape';
import { defaultUIState, IUIState, UIModule, uiReducer } from 'lib/ui';

import { initialGameState } from '../data/initial-state';
import { PhaserGameModule } from '../src/phaser/game.module';
import App from './app';

declare const process: any;

type IAppState = IUIState & II18nState | undefined;
type AppAction = IValueAction<any>;

/**
 * Main module for application. Defines all dependencies and provides default setup for configuration variables.
 *
 * @export
 * @extends {Container}
 */
export class AppModule extends Container implements IApplication {
	public eventManager: IEventEmitter = new EventEmitter();

	constructor() {
		super();

		DebugModule.register(this);

		// event manager
		this.bind<IEventEmitter>('event-manager').toConstantValue(this.eventManager);

		ServiceWorkerModule.register();

		// load modules

		// fullscreen bindings
		FullScreenModule.register(this, document.querySelector('body') as HTMLElement);

		// sound
		SoundModule.register(this);
		SoundScapeModule.register(this);

		// translations
		I18nModule.register(this);

		// phaser
		this.load(PhaserGameModule(this));

		// data store
		this.load(
			DataStoreModule<IAppState, AppAction>(
				this,
				{
					...defaultUIState,
					...defaultI18nState,
				},
				(state: IAppState, action: AppAction) => {
					const console = this.get<Console>('debug:console:DEBUG_STORE');
					console.log('reduce', state, action);

					// TODO: configure store
					state = uiReducer<IAppState, AppAction>(state, action);
					state = i18nReducer<IAppState, AppAction>(state, action);
					return state;
				},
			),
		);

		if ((window as any).__inversifyDevtools__) {
			(window as any).__inversifyDevtools__(this);
		}

		// rendering DOM - from outside of react
		this.bind<HTMLElement>('ui:root').toConstantValue(document.getElementById('app') as HTMLElement);
		// this.bind<React.ComponentFactory<any, any>>('ui:outlet-component').toConstantValue(React.createFactory(OutletComponent));
		// this.bind<IRenderer>('ui:renderer')
		// 	.to(ReactRenderer)
		// 	.inSingletonScope();

		// ui
		UIModule.register(this);

		// game
		const dataStore = new DataStore<IGameState>({} as any, this.eventManager);
		const game = new Game(initialGameState, dataStore);

		this.bind<Game>('game').toConstantValue(game);
	}

	public banner() {
		const console = this.get<Console>('debug:console');
		// tslint:disable:max-line-length
		console.log(
			'%c  ★★★ Black Dragon Framework ★★★  ',
			'display: block; line-height: 3rem; border-bottom: 5px double #a02060; font-family: fantasy; font-size: 2rem; color: #f02060; background-color: #000;',
		);
		console.log(
			`%c  author: ${process.env.APP.templateData.author.padEnd(37)}\n%c     app: ${process.env.APP.templateData.title.padEnd(37)}`,
			'line-height: 1.25rem; font-family: Consolas; font-weight: bold; font-size: 1.25rem; color: #a060d0; background-color: #000;',
			'line-height: 1.25rem; font-family: Consolas; font-weight: bold; font-size: 1.25rem; color: #a060d0; background-color: #000; border-bottom: 1px solid #600080;',
		);
	}

	public boot(): Promise<AppModule> {
		// start all required modules
		return this.get<I18nModule>('i18n:module')
			.boot()
			.then(this.get<FullScreenModule>('fullscreen:module').boot)
			.then(this.get<FullScreenModule>('ui:module').boot)
			.then(
				() => {
					this.banner();
					this.get<IEventEmitter>('event-manager').emit('app:boot');

					// const game = this.get<AncientMaze<IGameObjectState, IAncientMazeState<IGameObjectState>>>('game');
					// game.boot();

					const container = this.get<HTMLElement>('ui:root');

					ReactDOM.render((
							<DIContext.Provider value={this}>
								<App />
							</DIContext.Provider>
						),
							container,
						);
					// ReactDOM.render(<App/>, container);

					return this;
				},
				(error) => {
					console.error(error);

					return this;
				},
			);
	}
}
