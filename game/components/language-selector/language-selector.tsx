import { Container } from 'inversify';
import * as React from 'react';
import { hot } from 'react-hot-loader';
import { Store } from 'redux';

import { connectToInjector } from 'lib/di';
import { II18nActions, II18nState } from 'lib/i18n';
import { defaultUIState } from 'lib/ui';

/** Component public properties required to be provided by parent component. */
export interface ILanguageSelectorProps {
	view: (language: string, change: () => void) => React.ReactNode;
}

/** Internal component properties include properties injected via dependency injection. */
interface ILanguageSelectorInternalProps {
	di?: Container;
	dispatchSetCurrentLanguageAction: (...args: any[]) => void;
	store?: Store<II18nState>;
}

const diDecorator = connectToInjector<ILanguageSelectorProps, ILanguageSelectorInternalProps>({
	store: {
		dependencies: ['data-store'],
	},
	dispatchSetCurrentLanguageAction: {
		dependencies: ['i18n:actions'],
		value: (actions: II18nActions) => Promise.resolve((locale) => actions.setCurrentLanguage(locale)),
	},
});

/** Internal component state. */
interface ILanguageSelectorState {}

class LanguageSelectorComponent extends React.Component<ILanguageSelectorProps & ILanguageSelectorInternalProps, ILanguageSelectorState> {
	constructor(props) {
		super(props);
	}

	public render() {
		const {
			// prettier-ignore
			dispatchSetCurrentLanguageAction,
			store = { getState: () => ({ ...defaultUIState, language: 'en' }) },
			view,
		} = this.props;
		const { language } = store.getState();

		return view(language, dispatchSetCurrentLanguageAction);
	}
}

export default hot(module)(diDecorator(LanguageSelectorComponent));
