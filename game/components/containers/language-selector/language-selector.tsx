import { Container } from 'inversify';
import { isEqual, pickBy } from 'lodash';
import * as React from 'react';
import { hot } from 'react-hot-loader';
import { Store } from 'redux';

import { connectToInjector } from 'lib/di';
import { LanguageType } from 'lib/interfaces';

/** Component public properties required to be provided by parent component. */
export interface ILanguageSelectorExternalProps {
	view: (language: LanguageType, change: () => void) => React.ReactNode;
}

/** Internal component properties include properties injected via dependency injection. */
interface ILanguageSelectorInternalProps {
	di?: Container;
	dispatchSetCurrentLanguageAction: (...args: any[]) => void;
	store: Store<ILanguageSelectorState>;
}

/** Internal component state. */
interface ILanguageSelectorState {
	language: LanguageType;
}

const diDecorator = connectToInjector<ILanguageSelectorExternalProps, ILanguageSelectorInternalProps>({
	store: {
		dependencies: ['data-store'],
	},
	dispatchSetCurrentLanguageAction: {
		dependencies: ['i18n:actions@setCurrentLanguage'],
		value: (setCurrentLanguage: (locale: LanguageType) => void) => Promise.resolve(setCurrentLanguage),
	},
});

type ILanguageSelectorProps = ILanguageSelectorExternalProps & ILanguageSelectorInternalProps;

class LanguageSelectorComponent extends React.Component<ILanguageSelectorProps, ILanguageSelectorState> {
	private unsubscribeDataStore?: any;

	constructor(props) {
		super(props);
		const { language } = props.store.getState();
		this.state = { language };
	}

	public componentDidMount(): void {
		this.bindToStore();
	}

	public componentDidUpdate(): void {
		this.bindToStore();
	}

	public componentWillUnmount(): void {
		if (this.unsubscribeDataStore) {
			this.unsubscribeDataStore();
			this.unsubscribeDataStore = null;
		}
	}

	public shouldComponentUpdate(nextProps: ILanguageSelectorProps, nextState: ILanguageSelectorState): boolean {
		return !isEqual(this.props, nextProps) || !isEqual(this.state, nextState);
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

	/**
	 * Responsible for notifying component about state changes related to this component.
	 * If global state changes for keys defined in this component state it will transfer global state to components internal state.
	 */
	private bindToStore(): void {
		const { store } = this.props;

		if (!this.unsubscribeDataStore && !!store) {
			const keys = Object.keys(this.state);
			const filter = (state: ILanguageSelectorState) => pickBy(state, (_, key) => keys.indexOf(key) >= 0) as ILanguageSelectorState;
			this.unsubscribeDataStore = store.subscribe(() => {
				if (!!store) {
					this.setState(filter(store.getState()));
				}
			});
			this.setState(filter(store.getState()));
		}
	}
}

export default hot(module)(diDecorator(LanguageSelectorComponent));
