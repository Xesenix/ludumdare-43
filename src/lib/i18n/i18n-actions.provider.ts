import { interfaces } from 'inversify';
import { Store } from 'redux';

import { IDataStoreProvider } from 'lib/data-store';
import { ICreateSetAction } from 'lib/interfaces';

import { ICreateSetLanguageReadyAction, LanguageType } from './actions';

export interface II18nActions {
	setCurrentLanguage: (value: LanguageType) => void;
	setLanguageReady: (locale: LanguageType, value: boolean) => void;
}

export type II18nActionsProvider = () => Promise<II18nActions>;

export function I18nActionsProvider({ container }: interfaces.Context) {
	return () => container
		.get<IDataStoreProvider<any, any>>('data-store:provider')()
		.then((store: Store<any, any>) => {
			if (!container.isBound('i18n:actions')) {
				const createSetCurrentLanguageAction = container.get<ICreateSetAction<LanguageType>>('data-store:action:create:set-current-language');
				const createSetLanguageReadyAction = container.get<ICreateSetLanguageReadyAction>('data-store:action:create:set-language-ready');

				container.bind<II18nActions>('i18n:actions').toConstantValue({
					setCurrentLanguage: (value: LanguageType) => store.dispatch(createSetCurrentLanguageAction(value)),
					setLanguageReady: (locale: LanguageType, value: boolean) => store.dispatch(createSetLanguageReadyAction(locale, value)),
				});
			}

			return container.get<II18nActions>('i18n:actions');
		});
}
