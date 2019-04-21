import { IApplication, ICreateSetAction } from 'lib/interfaces';
import { UIModule as BaseUIModule } from 'lib/ui';

import { createSetCompactModeAction } from './actions';
import { UIActionsBootProvider } from './ui-actions.provider';


/**
 * Connect application fullscreen state with datastore.
 */
export class UIModule extends BaseUIModule {
	public static register(app: IApplication) {
		// call base ui module
		BaseUIModule.register(app);

		// add additional bootstrap logic needed to bootstrap extended ui module
		app.bind('ui:boot').toProvider(UIActionsBootProvider);

		// redux action creators
		app.bind<ICreateSetAction<boolean>>('data-store:action:create:set-compact-mode').toConstantValue(createSetCompactModeAction);

		// add data store keys that should be persisted between page refresh
		app.bind<string>('data-store:persist:state').toConstantValue('compactMode');
	}
}
