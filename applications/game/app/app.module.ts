import 'reflect-metadata';

import BaseAppModule from 'lib/core/base-app.module';
import { IApplication, IRegistrable } from 'lib/interfaces';

/**
 * Main module for application. Defines all dependencies and provides default setup for configuration variables.
 *
 * @export
 * @extends {Container}
 */
export default class AppModule extends BaseAppModule implements IApplication {
	protected getDependencies(): Promise<{ default: IRegistrable }[]> {
		return Promise.all<{ default: IRegistrable }>([
			import('i18n/i18n.module'),
			import(/* webpackChunkName: "ui" */ 'lib/random-generator/random-generator.module'),
			import(/* webpackChunkName: "ui" */ 'game/game.module'),
			import(/* webpackChunkName: "ui" */ 'lib/data-store/data-store.module'),
			import(/* webpackChunkName: "ui" */ 'lib/fullscreen/fullscreen.module'),
			import(/* webpackChunkName: "ui" */ 'lib/i18n/i18n.module'),
			import(/* webpackChunkName: "ui" */ 'phaser/phaser.module'),
			import(/* webpackChunkName: "ui" */ 'theme/theme.module'),
			import(/* webpackChunkName: "ui" */ 'themes/default/default-theme.module'),
			import(/* webpackChunkName: "ui" */ 'themes/modern/modern-theme.module'),
			import(/* webpackChunkName: "ui" */ 'themes/sharp/sharp-theme.module'),
			import(/* webpackChunkName: "ui" */ 'ui/ui.module'),
			import(/* webpackChunkName: "audio" */ 'lib/audio/audio.module'),
			// import(/* webpackChunkName: "audio" */ 'lib/phaser/audio.module'),
			import(/* webpackChunkName: "audio" */ 'lib/audio/audio-loader.module'),
			import(/* webpackChunkName: "audio" */ 'lib/sound-scape/sound-scape.module'),
			import(/* webpackChunkName: "audio" */ 'sound-director/sound-director.module'),
			import(/* webpackChunkName: "user" */ 'lib/acl/acl.module'),
			import(/* webpackChunkName: "user" */ 'lib/user/user.module'),
			import(/* webpackChunkName: "playfab" */ 'lib/playfab/playfab.module'),
			import(/* webpackChunkName: "kongregate" */ 'lib/kongregate/kongregate.module'),
		] as any);
	}

	protected start(): Promise<{ default: any }> {
		return import(/* webpackChunkName: "app" */ './app');
	}
}
