import { MuiThemeProvider, withStyles, WithStyles } from '@material-ui/core/styles';

import { Container } from 'inversify';
import * as React from 'react';
import { hot } from 'react-hot-loader';
import Loadable from 'react-loadable';
import { MemoryRouter, Route } from 'react-router-dom';
import { Store } from 'redux';

// elements
import CssBaseline from '@material-ui/core/CssBaseline';

import { connectToInjector } from 'lib/di/context';
import { defaultUIState, IUIState } from 'lib/ui';
import { IAppTheme } from 'theme';

import FullscreenLayoutComponent from 'components/layouts/fullscreen-layout/fullscreen-layout';
import PrimaryLayoutComponent from 'components/layouts/primary-layout/primary-layout';

import { styles } from './app.styles';

const Loader = () => <div>...</div>;

const MenuComponent = Loadable({ loading: Loader, loader: () => import(/* webpackChunkName: "menu" */ 'components/menu/menu') });
const IntroView = Loadable({ loading: Loader, loader: () => import(/* webpackChunkName: "intro" */ 'components/views/intro-view/intro-view') });
const GameView = Loadable({ loading: Loader, loader: () => import(/* webpackChunkName: "game" */ 'components/views/game-view/game-view') });
const ConfigurationView = Loadable({ loading: Loader, loader: () => import(/* webpackChunkName: "config" */ 'components/views/configuration-view/configuration-view') });

interface IAppProps {}

interface IAppInternalProps {
	di?: Container;
	store?: Store<IUIState, any>;
	getTheme: () => IAppTheme;
}

const diDecorator = connectToInjector<IAppProps, IAppInternalProps>({
	store: {
		dependencies: ['data-store'],
	},
	getTheme: {
		dependencies: ['theme:get-theme'],
	},
});

interface IAppState {
}

class App extends React.Component<IAppProps & IAppInternalProps & WithStyles<typeof styles>, IAppState & IUIState> {
	private unsubscribe?: any;

	constructor(props) {
		super(props);
		this.state = {
			...defaultUIState,
		};
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

	public render() {
		const { fullscreen = false } = this.state;
		const { getTheme } = this.props;

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
							menu={<MenuComponent/>}
							content={routing}
						/>
					)
					: (
						<PrimaryLayoutComponent
							menu={<MenuComponent/>}
							content={routing}
						/>
					)}
					{/* </React.StrictMode> */}
				</MemoryRouter>
			</MuiThemeProvider>
		);
	}

	private bindToStore(): void {
		const { store } = this.props;

		if (!this.unsubscribe && store) {
			this.unsubscribe = store.subscribe(() => {
				if (store) {
					this.setState(store.getState());
				}
			});
			this.setState(store.getState());
		}
	}
}

export default hot(module)(withStyles(styles)(diDecorator(App)));
