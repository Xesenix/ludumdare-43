import { interfaces } from 'inversify';
import { Reducer, Store } from 'redux';

import { IApplication, ICreateSetAction } from 'lib/interfaces';

import { createSetThemeAction } from './actions';
import { reducer } from './reducers';
import { ThemeBootProvider } from './theme-boot.provider';
import { IAppTheme, IThemeState, ThemesNames, ThemesProviderType } from './theme.interfaces';
import { ThemesProvider } from './themes.provider';

export class ThemeModule {
	public static register(app: IApplication) {

		// define logic needed to bootstrap module
		app.bind('boot').toProvider(ThemeBootProvider);

		// available application themes
		app.bind<ThemesProviderType>('theme:themes').toProvider(ThemesProvider);

		// current application theme
		app.bind<Promise<() => IAppTheme>>('theme:get-theme').toDynamicValue(async ({ container }: interfaces.Context) => {
			const themes = await container.get<ThemesProviderType>('theme:themes')();
			const store = container.get<Store<IThemeState, any>>('data-store');

			return () => {
				const { theme } = store.getState();
				return themes[theme];
			};
		});

		// redux action creators
		app.bind<ICreateSetAction<ThemesNames>>('data-store:action:create:set-theme').toConstantValue(createSetThemeAction);

		// add data store keys that should be persisted between page refresh
		app.bind<string>('data-store:persist:state').toConstantValue('theme');

		// add reducer from this module
		app.bind<Reducer<any, any>>('data-store:reducers').toConstantValue(reducer);
	}
}
