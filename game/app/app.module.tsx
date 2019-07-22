import { Container } from 'inversify';
import * as React from 'react';
import * as ReactDOM from 'react-dom';

// core
import EventManagerModule from 'lib/core/event-manager.module';
import DebugModule from 'lib/debug/debug.module';

import { DIContext } from 'lib/di';
import { IApplication, IEventEmitter } from 'lib/interfaces';

import 'reflect-metadata';

declare const process: any;

/**
 * Main module for application. Defines all dependencies and provides default setup for configuration variables.
 *
 * @export
 * @extends {Container}
 */
export class AppModule extends Container implements IApplication {
	constructor(
		root: HTMLElement,
		document: Document,
		window: Window,
	) {
		super();

		if ((window as any).__inversifyDevtools__) {
			(window as any).__inversifyDevtools__(this);
		}

		// core dependencies
		DebugModule.register(this);
		EventManagerModule.register(this);

		// rendering DOM - from outside of react
		this.bind<Document>('document').toConstantValue(document);
		this.bind<Window>('window').toConstantValue(window);
		this.bind<HTMLElement>('ui:root').toConstantValue(root);
	}

	public banner() {
		const console = this.get<Console>('debug:console');
		console.debug('AppModule:booted');
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

	public load() {
		const dependencies = [
			import(/* webpackChunkName: "ui" */ 'game/game.module'),
			import(/* webpackChunkName: "ui" */ 'lib/data-store/data-store.module'),
			import(/* webpackChunkName: "ui" */ 'lib/fullscreen/fullscreen.module'),
			import(/* webpackChunkName: "ui" */ 'lib/i18n/i18n.module'),
			import(/* webpackChunkName: "ui" */ 'lib/sound/sound.module'),
			import(/* webpackChunkName: "ui" */ 'lib/sound-scape/sound-scape.module'),
			import(/* webpackChunkName: "ui" */ 'phaser/game.module'),
			import(/* webpackChunkName: "ui" */ 'theme/theme.module'),
			import(/* webpackChunkName: "ui" */ 'themes/default/default-theme.module'),
			import(/* webpackChunkName: "ui" */ 'themes/modern/modern-theme.module'),
			import(/* webpackChunkName: "ui" */ 'themes/sharp/sharp-theme.module'),
			import(/* webpackChunkName: "ui" */ 'ui/ui.module'),
		];
		return Promise.all<{ default: { register: (IApplication) => void } }>(dependencies)
			.then((modules) => modules.forEach(({ default: m }) => m.register(this)));
	}

	public boot(): Promise<void[]> {
		const console = this.get<Console>('debug:console');
		const providers = this.getAll<() => Promise<void>>('boot');
		let progress = 0;

		return Promise.all(
			providers.map((provider: any) => provider().then(() => {
				console.debug(`AppModule:boot:progress ${++progress}/${providers.length}`);
			})),
		);
	}

	public start(): Promise<AppModule> {
		// start all required modules
		const console = this.get<Console>('debug:console');
		const container = this.get<HTMLElement>('ui:root');

		return this.load()
			.then(() => this.boot())
			.then(() => import(/* webpackChunkName: "app" */ './app'))
			.then(({ default: App }) => {
				this.banner();
				this.get<IEventEmitter>('event-manager').emit('app:boot');

				ReactDOM.render((
						<DIContext.Provider value={this}>
							<App />
						</DIContext.Provider>
					),
					container,
				);

				return this;
			},
			(error) => {
				console.error(error);

				return this;
			},
		);
	}
}
