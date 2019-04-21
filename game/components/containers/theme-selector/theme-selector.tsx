import { Container } from 'inversify';
import * as React from 'react';
import { hot } from 'react-hot-loader';
import { Store } from 'redux';

import { connectToInjector } from 'lib/di/context';
import { IUIState } from 'lib/ui/reducers';
import { defaultUIState } from 'lib/ui/reducers';
import { IUIActions } from 'lib/ui/ui-actions.provider';

/** Component public properties required to be provided by parent component. */
export interface IThemeSelectorProps {
	view: (theme: string, change: () => void) => React.ReactNode;
}

/** Internal component properties include properties injected via dependency injection. */
interface IThemeSelectorInternalProps {
	di?: Container;
	dispatchSetThemeAction: (...args: any[]) => void;
	store?: Store<IUIState>;
}

/** Internal component state. */
interface IThemeSelectorState {
}

const diDecorator = connectToInjector<IThemeSelectorProps, IThemeSelectorInternalProps>({
	store: {
		dependencies: ['data-store'],
	},
	dispatchSetThemeAction: {
		dependencies: ['ui:actions'],
		value: (actions: IUIActions) => Promise.resolve((theme: string) => actions.setTheme(theme)),
	},
});

class ThemeSelectorComponent extends React.Component<IThemeSelectorProps & IThemeSelectorInternalProps, IThemeSelectorState> {
	constructor(props) {
		super(props);
		this.state = {};
	}

	public render(): any {
		const {
			// prettier-ignore
			dispatchSetThemeAction,
			store = { getState: () => ({ ...defaultUIState, theme: 'light' }) },
			view,
		} = this.props;
		const { theme } = store.getState();

		return view(theme, dispatchSetThemeAction);
	}
}

export default hot(module)(diDecorator(ThemeSelectorComponent));
