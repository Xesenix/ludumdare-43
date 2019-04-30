import { Container } from 'inversify';
import { isEqual, pickBy } from 'lodash';
import * as React from 'react';
import { hot } from 'react-hot-loader';
import { Store } from 'redux';

import { connectToInjector } from 'lib/di/context';
import { ThemesNames } from 'theme';

/** Component public properties required to be provided by parent component. */
export interface IThemeSelectorExternalProps {
	view: (theme: string, change: () => void) => React.ReactNode;
}

/** Internal component properties include properties injected via dependency injection. */
interface IThemeSelectorInternalProps {
	di?: Container;
	dispatchSetThemeAction: (...args: any[]) => void;
	store?: Store<IThemeSelectorState>;
}

/** Internal component state. */
interface IThemeSelectorState {
	theme: ThemesNames;
}

const diDecorator = connectToInjector<IThemeSelectorExternalProps, IThemeSelectorInternalProps>({
	store: {
		dependencies: ['data-store'],
	},
	dispatchSetThemeAction: {
		dependencies: ['ui:actions@setTheme'],
		value: (setTheme: (theme: string) => void) => Promise.resolve(setTheme),
	},
});

type IThemeSelectorProps = IThemeSelectorExternalProps & IThemeSelectorInternalProps;

class ThemeSelectorComponent extends React.Component<IThemeSelectorProps, IThemeSelectorState> {
	private unsubscribeDataStore?: any;

	constructor(props) {
		super(props);
		const { theme } = props.store.getState();
		this.state = { theme };
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

	public shouldComponentUpdate(nextProps: IThemeSelectorProps, nextState: IThemeSelectorState): boolean {
		return !isEqual(this.props, nextProps) || !isEqual(this.state, nextState);
	}

	public render(): any {
		const {
			// prettier-ignore
			dispatchSetThemeAction,
			view,
		} = this.props;
		const { theme } = this.state;

		return view(theme, dispatchSetThemeAction);
	}

	/**
	 * Responsible for notifying component about state changes related to this component.
	 * If global state changes for keys defined in this component state it will transfer global state to components internal state.
	 */
	private bindToStore(): void {
		const { store } = this.props;

		if (!this.unsubscribeDataStore && !!store) {
			const keys = Object.keys(this.state);
			const filter = (state: IThemeSelectorState) => pickBy(state, (_, key) => keys.indexOf(key) >= 0) as IThemeSelectorState;
			this.unsubscribeDataStore = store.subscribe(() => {
				if (!!store) {
					this.setState(filter(store.getState()));
				}
			});
			this.setState(filter(store.getState()));
		}
	}
}

export default hot(module)(diDecorator(ThemeSelectorComponent));
