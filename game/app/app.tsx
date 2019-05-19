import * as React from 'react';
import { hot } from 'react-hot-loader';
import Loadable from 'react-loadable';
import { MemoryRouter, Route, Switch } from 'react-router-dom';

import { connectToInjector } from 'lib/di/context';
import { II18nLanguagesState } from 'lib/i18n';
import { LanguageType } from 'lib/interfaces';
import {
	// prettier-ignore
	diStoreComponentDependencies,
	IStoreComponentInternalProps,
	StoreComponent,
} from 'lib/utils/store.component';
import { IAppTheme, ThemesNames } from 'theme';

// elements
import CssBaseline from '@material-ui/core/CssBaseline';
import { MuiThemeProvider } from '@material-ui/core/styles';

import FullscreenLayoutComponent from 'components/layouts/fullscreen-layout/fullscreen-layout';
import PrimaryLayoutComponent from 'components/layouts/primary-layout/primary-layout';
import Loader from 'components/loader/loader';

const MenuComponent = Loadable({ loading: (props) => <Loader size={32} {...props}/>, loader: () => import(/* webpackChunkName: "menu" */ 'components/menu/menu') });
const IntroView = Loadable({ loading: Loader, loader: () => import(/* webpackChunkName: "intro" */ 'components/views/intro-view/intro-view') });
const GameView = Loadable({ loading: Loader, loader: () => import(/* webpackChunkName: "game" */ 'components/views/game-view/game-view') });
const ConfigurationView = Loadable({ loading: Loader, loader: () => import(/* webpackChunkName: "config" */ 'components/views/configuration-view/configuration-view') });

interface IAppProps {}

interface IAppInternalProps extends IStoreComponentInternalProps<IAppState> {
	getTheme: () => IAppTheme;
}

interface IAppState {
	/** required for interface updates after changing fullscreen state */
	fullscreen: boolean;
	/** required for interface updates after changing application language */
	language: LanguageType;
	/** required for interface updates after loading language */
	languages: II18nLanguagesState;
	/** required for interface updates after changing application theme */
	theme: ThemesNames;
}

const diDecorator = connectToInjector<IAppProps, IAppInternalProps>({
	...diStoreComponentDependencies,
	getTheme: {
		dependencies: ['theme:get-theme()'],
	},
});

type AppProps = IAppProps & IAppInternalProps;

class App extends StoreComponent<AppProps, IAppState> {
	constructor(props) {
		super(props, [
			// prettier-ignore
			'fullscreen',
			'theme',
			'language',
			'languages',
		]);
	}

	public componentDidCatch(error, info) {
		console.error('error', error, info);
	}

	public render() {
		const { fullscreen = false } = this.state;
		const { getTheme } = this.props;

		console.log('App:render');

		const routing = (
			<Switch>
				<Route exact path="/" component={IntroView}/>
				<Route path="/game" component={GameView}/>
				<Route path="/config" component={ConfigurationView}/>
			</Switch>
		);

		return (
			<MuiThemeProvider theme={getTheme()}>
				<CssBaseline />
				<MemoryRouter>
					{/* <React.StrictMode> */}
					{fullscreen
					? (
						<FullscreenLayoutComponent
							Menu={MenuComponent}
							content={routing}
						/>
					)
					: (
						<PrimaryLayoutComponent
							Menu={MenuComponent}
							content={routing}
							// loading={GameView.}
						/>
					)}
					{/* </React.StrictMode> */}
				</MemoryRouter>
			</MuiThemeProvider>
		);
	}
}

export default hot(module)(diDecorator(App));
