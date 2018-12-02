import { MuiThemeProvider, withStyles, WithStyles } from '@material-ui/core/styles';

import { Container } from 'inversify';
import * as React from 'react';
import { hot } from 'react-hot-loader';
import Loadable from 'react-loadable';
import { Store } from 'redux';

// elements
import Button from '@material-ui/core/Button';
import CssBaseline from '@material-ui/core/CssBaseline';
import LinearProgress from '@material-ui/core/LinearProgress';
import Paper from '@material-ui/core/Paper';
import Typography from '@material-ui/core/Typography';

import { connectToInjector } from 'lib/di';
import { defaultUIState, IUIState } from 'lib/ui';

import { styles } from './app.styles';
import { appThemes } from './app.themes';

import { IPhaserProvider } from '../src/phaser/game.module';

const Loader = () => <div>...</div>;

const GameView = Loadable({ loading: Loader, loader: () => import('../components/game-view/game-view') });

interface IAppProps {
	di?: Container;
	store?: Store<IUIState, any>;
	__: (key: string) => string;
	phaserProvider: IPhaserProvider;
}

const diDecorator = connectToInjector<IAppProps>({
	store: {
		dependencies: ['data-store'],
	},
	__: {
		dependencies: ['i18n:translate'],
	},
	phaserProvider: {
		dependencies: ['phaser:provider'],
	},
});

interface IAppState {
	ready: boolean;
	phaserReady: boolean;
	loading: boolean;
}

class App extends React.Component<IAppProps & WithStyles<typeof styles>, IAppState & IUIState> {
	private unsubscribe?: any;

	constructor(props) {
		super(props);
		this.state = {
			...defaultUIState,
			ready: false,
			phaserReady: false,
			loading: false,
		};
	}

	public componentDidMount(): void {
		const { phaserProvider } = this.props;
		// optional preloading
		phaserProvider().then(() => this.setState({ phaserReady: true }));
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
		const { classes, __ } = this.props;
		const { loading, ready, phaserReady, theme = 'light' } = this.state;

		const gameView = ready ? (
			<GameView />
		) : phaserReady ? (
			<Button color="primary" variant="extendedFab" onClick={this.start} size="large">
				{__('Start')}
			</Button>
		) : (
			<Typography component="p">{`${__('loading')}: please wait`}</Typography>
		);

		return (
			<MuiThemeProvider theme={appThemes[theme]}>
				<CssBaseline />
				<Paper className={classes.root} elevation={1}>
					{loading ? <LinearProgress /> : null}
					<Typography className={classes.title} variant="display4" component="h1" align="center">
						The greatest sacrifice
					</Typography>
					<Typography className={classes.title} variant="display1" component="h2" align="center">
						Ludumdare 43 edition
					</Typography>
					<Typography className={classes.headline} variant="headline" component="p" align="center">
						You are the leader of a small village in this very hostile world you need to decide if you will pay tribute to the gods or stand on your own against plagues that visit this world every year.<br/>
						Manage your villagers assign them to work so they can gather resources for sacrifices or village development. Or leave them idle so they can multiply and sacrifice them to permanently weaken creatures disturbing this world.
					</Typography>
					{gameView}
				</Paper>
			</MuiThemeProvider>
		);
	}

	private start = () => {
		this.setState({ loading: true });
		// TODO: wrong type definition for preload
		(GameView.preload() as any).then(() => this.setState({ ready: true, loading: false }));
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

export default hot(module)(diDecorator(withStyles(styles)(App)));
