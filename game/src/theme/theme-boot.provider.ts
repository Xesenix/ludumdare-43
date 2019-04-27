import { interfaces } from 'inversify';
import { Store } from 'redux';

import { ICreateSetAction } from 'lib/interfaces';

import { ThemesNames } from './theme.interfaces';

export function ThemeBootProvider({ container }: interfaces.Context) {
	const console: Console = container.get<Console>('debug:console');
	console.debug('ThemeBootProvider');

	return () => container.get<() => Promise<Store<any, any>>>('data-store:provider')()
		.then((store: Store<any, any>) => {
			const createSetThemeAction = container.get<ICreateSetAction<ThemesNames>>('data-store:action:create:set-theme');
			container.bind('ui:actions')
				.toConstantValue((value: ThemesNames) => store.dispatch(createSetThemeAction(value)))
				.whenTargetNamed('setTheme');
		});
}
