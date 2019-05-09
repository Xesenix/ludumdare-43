import { isEqual } from 'lodash';
import * as React from 'react';
import { hot } from 'react-hot-loader';
import { Store } from 'redux';

import { connectToInjector } from 'lib/di';
import { LanguageType } from 'lib/interfaces';
import { filterByKeys } from 'lib/utils/filter-keys';

import { II18nLanguagesState, II18nTranslation } from '../i18n.interfaces';

/** Component public properties required to be provided by parent component. */
export interface II18nLabelExternalProps {
	render: (__: II18nTranslation) => string;
}

/** Internal component properties include properties injected via dependency injection. */
interface II18nLabelInternalProps {
	__: II18nTranslation;
	store: Store<II18nLabelState>;
}

/** Internal component state. */
interface II18nLabelState {
	/** required for interface updates after changing application language */
	language: LanguageType;
	/** required for interface updates after loading language */
	languages: II18nLanguagesState;
}

const diDecorator = connectToInjector<II18nLabelExternalProps, II18nLabelInternalProps>({
	__: {
		dependencies: ['i18n:translate'],
	},
	store: {
		dependencies: ['data-store'],
	},
});

type II18nLabelProps = II18nLabelExternalProps & II18nLabelInternalProps;

class I18nLabel extends React.Component<II18nLabelProps, II18nLabelState> {
	private unsubscribeDataStore?: any;

	private filter = filterByKeys<any>([
		// prettier-ignore
		'language',
		'languages',
	]);

	constructor(props) {
		super(props);

		this.state = this.filter(props.store.getState());
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

	public shouldComponentUpdate(nextProps: any, nextState: any): boolean {
		return !isEqual(this.props, nextProps) || !isEqual(this.state, nextState);
	}

	public render() {
		return this.props.render(this.props.__);
	}

	/**
	 * Responsible for notifying component about state changes related to this component.
	 * If global state changes for keys defined in this component state it will transfer global state to components internal state.
	 */
	private bindToStore(): void {
		const { store } = this.props;

		if (!this.unsubscribeDataStore && !!store) {
			this.unsubscribeDataStore = store.subscribe(() => {
				if (!!store) {
					this.setState(this.filter(store.getState()));
				}
			});
			this.setState(this.filter(store.getState()));
		}
	}
}

export default hot(module)(diDecorator(I18nLabel));
