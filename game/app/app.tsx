import * as React from 'react';
import { hot } from 'react-hot-loader';
import { MemoryRouter } from 'react-router-dom';

import LazyLoaderFactory from 'lib/core/components/lazy-loader-factory';
import { connectToInjector } from 'lib/di';
import { II18nLanguagesState } from 'lib/i18n';
import { LanguageType } from 'lib/interfaces';
import { IAppTheme, ThemesNames } from 'theme';

// elements
import CssBaseline from '@material-ui/core/CssBaseline';
import { MuiThemeProvider } from '@material-ui/core/styles';

import FullscreenLayoutComponent from 'components/layouts/fullscreen-layout/fullscreen-layout';
import PrimaryLayoutComponent from 'components/layouts/primary-layout/primary-layout';
import Loader from 'components/loader/loader';
import LoaderErrorView from 'components/loader/loader-error-view';
import { IMenuExternalProps } from 'components/menu/menu';

import AppRouting from './app.routing';

const SmallLoader = () => <Loader size={48}/>;
const BigLoader = () => <Loader size={128}/>;

const MenuComponent = LazyLoaderFactory<IMenuExternalProps>(
	() => import(/* webpackChunkName: "menu" */ 'components/menu/menu'),
	SmallLoader,
	LoaderErrorView,
);

/** Component public properties required to be provided by parent component. */
interface IAppExternalProps {}

/** Internal component properties include properties injected via dependency injection. */
interface IAppInternalProps {
	bindToStore: (keys: (keyof IAppState)[]) => IAppState;
	getTheme: () => IAppTheme;
}

/** Internal component state. */
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

type IAppProps = IAppExternalProps & IAppInternalProps;

const diDecorator = connectToInjector<IAppExternalProps, IAppInternalProps>({
	bindToStore: {
		dependencies: ['data-store:bind'],
	},
	getTheme: {
		dependencies: ['theme:get-theme()'],
	},
}, { Preloader: BigLoader, });

function App(props: IAppProps) {
	const { getTheme, bindToStore } = props;
	const { fullscreen = false } = bindToStore([
		// prettier-ignore
		'fullscreen',
		'theme',
		'language',
		'languages',
	]);

	const routing = <AppRouting />;

	return (
		<MuiThemeProvider theme={getTheme()}>
			<CssBaseline />
			<MemoryRouter>
				{/* <React.StrictMode> */}
				{fullscreen ? (
					<FullscreenLayoutComponent Menu={MenuComponent} content={routing} />
				) : (
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

export default hot(module)(diDecorator(App));
