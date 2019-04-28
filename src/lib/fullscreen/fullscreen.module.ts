
import { IApplication, ICreateSetAction } from 'lib/interfaces';

import { FullscreenBootProvider } from './fullscreen-boot.provider';
/**
 * Connect application fullscreen state with datastore.
 */
export class FullScreenModule {
	public static register(app: IApplication, root: HTMLElement): void {
		// define logic needed to bootstrap module
		app.bind('boot').toProvider(FullscreenBootProvider);

		// redux action creators
		app.bind<ICreateSetAction<boolean>>('data-store:action:create:set-fullscreen').toConstantValue(createSetFullscreenAction);

		app.bind<HTMLElement>('ui:fullscreen-root').toConstantValue(root);

	}
}
