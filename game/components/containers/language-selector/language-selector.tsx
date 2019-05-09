import { Container } from 'inversify';
import * as React from 'react';
import { hot } from 'react-hot-loader';

import { connectToInjector } from 'lib/di';
import { LanguageType } from 'lib/interfaces';
import {
	// prettier-ignore
	diStoreComponentDependencies,
	IStoreComponentInternalProps,
	StoreComponent,
} from 'lib/utils/store.component';

/** Component public properties required to be provided by parent component. */
export interface ILanguageSelectorExternalProps {
	view: (language: LanguageType, change: () => void) => React.ReactNode;
}

/** Internal component properties include properties injected via dependency injection. */
interface ILanguageSelectorInternalProps extends IStoreComponentInternalProps<ILanguageSelectorState> {
	di?: Container;
	dispatchSetCurrentLanguageAction: (...args: any[]) => void;
}

/** Internal component state. */
interface ILanguageSelectorState {
	language: LanguageType;
}

const diDecorator = connectToInjector<ILanguageSelectorExternalProps, ILanguageSelectorInternalProps>({
	...diStoreComponentDependencies,
	dispatchSetCurrentLanguageAction: {
		dependencies: ['i18n:actions@setCurrentLanguage'],
		value: (setCurrentLanguage: (locale: LanguageType) => void) => Promise.resolve(setCurrentLanguage),
	},
});

type ILanguageSelectorProps = ILanguageSelectorExternalProps & ILanguageSelectorInternalProps;

class LanguageSelectorComponent extends StoreComponent<ILanguageSelectorProps, ILanguageSelectorState> {
	constructor(props) {
		super(props, [
			// prettier-ignore
			'language',
		]);
	}

	public render() {
		const {
			// prettier-ignore
			dispatchSetCurrentLanguageAction,
			view,
		} = this.props;
		const { language } = this.state;

		return view(language, dispatchSetCurrentLanguageAction);
	}
}

export default hot(module)(diDecorator(LanguageSelectorComponent));
