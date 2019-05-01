import { Container } from 'inversify';
import { isEqual } from 'lodash';
import * as React from 'react';
import { hot } from 'react-hot-loader';
import Loadable from 'react-loadable';
import { MemoryRouter, Route } from 'react-router-dom';
import { Store } from 'redux';

// elements
import CircularProgress from '@material-ui/core/CircularProgress';
import CssBaseline from '@material-ui/core/CssBaseline';
import Grid from '@material-ui/core/Grid';
import { MuiThemeProvider } from '@material-ui/core/styles';

import { connectToInjector } from 'lib/di/context';
import { LanguageType } from 'lib/interfaces';
import { IAppTheme, ThemesNames } from 'theme';

import FullscreenLayoutComponent from 'components/layouts/fullscreen-layout/fullscreen-layout';
import PrimaryLayoutComponent from 'components/layouts/primary-layout/primary-layout';
import { filterByKeys } from 'lib/utils/filter-keys';

const Loader = () => (
	<Grid
		container
		spacing={0}
		alignItems="center"
		style={{ padding: '64px 0', position: 'relative', marginLeft: '50%', left: '-64px',}}
	>
		<CircularProgress size={128}/>
	</Grid>
);

const MenuComponent = Loadable({ loading: Loader, loader: () => import(/* webpackChunkName: "menu" */ 'components/menu/menu') });
const IntroView = Loadable({ loading: Loader, loader: () => import(/* webpackChunkName: "intro" */ 'components/views/intro-view/intro-view') });
const GameView = Loadable({ loading: Loader, loader: () => import(/* webpackChunkName: "game" */ 'components/views/game-view/game-view') });
const ConfigurationView = Loadable({ loading: Loader, loader: () => import(/* webpackChunkName: "config" */ 'components/views/configuration-view/configuration-view') });

interface IAppProps {}

interface IAppInternalProps {
	di?: Container;
	getTheme: () => IAppTheme;
	store: Store<IAppState, any>;
}

interface IAppState {
	/** required for interface updates after changing fullscreen state */
	fullscreen: boolean;
	/** required for interface updates after changing application language */
	language: LanguageType;
	/** required for interface updates after loading language */
	languages: any;
	/** required for interface updates after changing application theme */
	theme: ThemesNames;
}

const diDecorator = connectToInjector<IAppProps, IAppInternalProps>({
	store: {
		dependencies: ['data-store'],
	},
	getTheme: {
		dependencies: ['theme:get-theme'],
	},
});

type AppProps = IAppProps & IAppInternalProps;

class App extends React.Component<AppProps, IAppState> {
	private unsubscribe?: any;

	private filter = filterByKeys<IAppState>([
		// prettier-ignore
		'fullscreen',
		'theme',
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
		if (this.unsubscribe) {
			this.unsubscribe();
		}
	}

	public shouldComponentUpdate(nextProps: AppProps, nextState: IAppState): boolean {
		return !isEqual(this.props, nextProps) || !isEqual(this.state, nextState);
	}

	public render() {
		const { fullscreen = false } = this.state;
		const { getTheme } = this.props;

		console.log('App:render');

		const routing = (
			<>
				<Route exact path="/" component={IntroView}/>
				<Route path="/game" component={GameView}/>
				<Route path="/config" component={ConfigurationView}/>
			</>
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

	/**
	 * Responsible for notifying component about state changes related to this component.
	 * If global state changes for keys defined in this component state it will transfer global state to components internal state.
	 */
	private bindToStore(): void {
		const { store } = this.props;

		if (!this.unsubscribe && !!store) {
			this.unsubscribe = store.subscribe(() => {
				if (!!store) {
					this.setState(this.filter(store.getState()));
				}
			});
			this.setState(this.filter(store.getState()));
		}
	}
}

export default hot(module)(diDecorator(App));
