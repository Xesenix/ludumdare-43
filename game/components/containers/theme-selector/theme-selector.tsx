import { Container } from 'inversify';
import * as React from 'react';
import { hot } from 'react-hot-loader';

import { connectToInjector } from 'lib/di/context';
import {
	// prettier-ignore
	diStoreComponentDependencies,
	IStoreComponentInternalProps,
	StoreComponent,
} from 'lib/utils/store.component';
import { ThemesNames } from 'theme';

/** Component public properties required to be provided by parent component. */
export interface IThemeSelectorExternalProps {
	view: (theme: string, change: () => void) => React.ReactNode;
}

/** Internal component properties include properties injected via dependency injection. */
interface IThemeSelectorInternalProps extends IStoreComponentInternalProps<IThemeSelectorState> {
	di?: Container;
	dispatchSetThemeAction: (...args: any[]) => void;
}

/** Internal component state. */
interface IThemeSelectorState {
	theme: ThemesNames;
}

const diDecorator = connectToInjector<IThemeSelectorExternalProps, IThemeSelectorInternalProps>({
	...diStoreComponentDependencies,
	dispatchSetThemeAction: {
		dependencies: ['ui:actions@setTheme'],
		value: (setTheme: (theme: string) => void) => Promise.resolve(setTheme),
	},
});

type IThemeSelectorProps = IThemeSelectorExternalProps & IThemeSelectorInternalProps;

class ThemeSelectorComponent extends StoreComponent<IThemeSelectorProps, IThemeSelectorState> {
	constructor(props) {
		super(props, [
			// prettier-ignore
			'theme',
		]);
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
}

export default hot(module)(diDecorator(ThemeSelectorComponent));
