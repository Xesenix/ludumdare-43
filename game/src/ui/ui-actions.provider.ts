import { interfaces } from 'inversify';
import { Store } from 'redux';

import { ICreateSetAction } from 'lib/interfaces';

export function UIActionsBootProvider({ container }: interfaces.Context) {
	const console: Console = container.get<Console>('debug:console');
	console.debug('UIActionsProvider');

	return () => container.get<() => Promise<Store<any, any>>>('data-store:provider')()
		.then((store: Store<any, any>) => {
			const createSetCompactModeAction = container.get<ICreateSetAction<boolean>>('data-store:action:create:set-compact-mode');

			container.bind('ui:actions').toConstantValue((value: boolean) => store.dispatch(createSetCompactModeAction(value))).whenTargetNamed('setCompactMode');
		});
}
