import { withStyles, WithStyles } from '@material-ui/core';
import * as React from 'react';
import { hot } from 'react-hot-loader';
import Loadable from 'react-loadable';
import { withRouter } from 'react-router';
import { RouteComponentProps } from 'react-router';
import { Link as RouterLink } from 'react-router-dom';
import { Store } from 'redux';

import { connectToInjector } from 'lib/di/context';
import { II18nTranslation } from 'lib/i18n';
import { defaultUIState, IUIState } from 'ui/reducers';

// elements
import CircularProgress from '@material-ui/core/CircularProgress';
import Fab, { FabProps } from '@material-ui/core/Fab';
// icons
import ConfigIcon from '@material-ui/icons/Build';
import FullScreenIcon from '@material-ui/icons/Fullscreen';
import FullScreenExitIcon from '@material-ui/icons/FullscreenExit';
// import PausedIcon from '@material-ui/icons/PauseCircleFilled';
// import PlayIcon from '@material-ui/icons/PlayCircleFilled';
import BackIcon from '@material-ui/icons/Undo';
import MuteOnIcon from '@material-ui/icons/VolumeOff';
import MuteOffIcon from '@material-ui/icons/VolumeUp';

import { styles } from './menu.styles';

const Loader = () => <CircularProgress />;
const LanguageSelectorComponent = Loadable({ loading: Loader, loader: () => import(/* webpackChunkName: "ui" */ 'components/containers/language-selector/language-selector') });

/** Component public properties required to be provided by parent component. */
export interface IMenuProps extends RouteComponentProps {
}

/** Internal component properties include properties injected via dependency injection. */
interface IMenuInternalProps {
	__: II18nTranslation;
	dispatchCreateSetMutedAction: (value: boolean) => void;
	dispatchSetFullscreenAction: (value: boolean) => void;
	dispatchCreateSetCompactModeAction: (value: boolean) => void;
	store?: Store<IUIState>;
}

/** Internal component state. */
interface IMenuState extends IUIState {
}

const diDecorator = connectToInjector<IMenuProps, IMenuInternalProps>({
	__: {
		dependencies: ['i18n:translate'],
	},
	dispatchSetFullscreenAction: {
		dependencies: ['ui:actions@setFullscreen'],
		value: (setFullscreen: (value: boolean) => void) => Promise.resolve(setFullscreen),
	},
	dispatchCreateSetMutedAction: {
		dependencies: ['ui:actions@setMuted'],
		value: (setMuted: (value: boolean) => void) => Promise.resolve(setMuted),
	},
	dispatchCreateSetCompactModeAction: {
		dependencies: ['ui:actions@setCompactMode'],
		value: (setCompactMode: (value: boolean) => void) => Promise.resolve(setCompactMode),
	},
	store: {
		dependencies: ['data-store'],
	},
});

class MenuComponent extends React.Component<IMenuProps & IMenuInternalProps & WithStyles<typeof styles>, IMenuState> {
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

	public render(): any {
		const {
			// prettier-ignore
			compactMode,
		} = this.state;
		const {
			// prettier-ignore
			store,
			classes,
			location,
			__,
		} = this.props;
		const {
			// prettier-ignore
			fullscreen = false,
			mute = false,
		} = store ? store.getState() : {};

		return (
			<>
				{location.pathname !== '/config' ? (
					<Fab
						// prettier-ignore
						className={classes.button}
						component={this.renderConfigLink}
						key="config"
						variant="extended"
					>
						<ConfigIcon className={classes.extendedIcon} />
						{__('Configuration')}
					</Fab>
				) : null}

				{location.pathname === '/config' ? (
					<Fab
						// prettier-ignore
						className={classes.button}
						component={this.renderGameLink}
						key="game"
						variant="extended"
					>
						<BackIcon className={classes.extendedIcon} />
						{__('Back')}
					</Fab>
				) : null}

				<Fab
					// prettier-ignore
					className={classes.button}
					color="secondary"
					key="fullscreen"
					onClick={this.toggleFullScreen}
					variant="extended"
				>
					{fullscreen ? <FullScreenExitIcon className={classes.extendedIcon} /> : <FullScreenIcon className={classes.extendedIcon} />}
					{__('Fullscreen')}
				</Fab>
				{/* <Fab color="primary" variant="extended" className={classes.button} onClick={this.togglePause}>
					{paused ? <PausedIcon className={classes.extendedIcon} /> : <PlayIcon className={classes.extendedIcon} />}
					{__('Pause')}
				</Fab> */}
				<Fab
					// prettier-ignore
					className={classes.button}
					color="primary"
					onClick={this.toggleMute}
					variant="extended"
				>
					{mute ? <MuteOnIcon className={classes.extendedIcon} /> : <MuteOffIcon className={classes.extendedIcon} />}
					{__('Mute')}
				</Fab>
				<Fab
					// prettier-ignore
					className={classes.button}
					color={compactMode ? 'secondary' : 'default'}
					onClick={this.toggleCompactMode}
					variant="extended"
				>
					{__('Compact')}
				</Fab>

				<LanguageSelectorComponent view={this.renderLanguageSelector} />
			</>
		);
	}

	private renderConfigLink = (props: FabProps) => <RouterLink to="/config" {...props}/>;

	private renderGameLink = (props: FabProps) => <RouterLink to="/game" {...props}/>;

	private toggleFullScreen = (): void => {
		const { dispatchSetFullscreenAction, store } = this.props;
		const { fullscreen = false } = store ? store.getState() : {};
		dispatchSetFullscreenAction(!fullscreen);
	}

	private toggleMute = (): void => {
		const { dispatchCreateSetMutedAction, store } = this.props;
		const { mute = false } = store ? store.getState() : {};
		dispatchCreateSetMutedAction(!mute);
	}

	private toggleCompactMode = (): void => {
		const { dispatchCreateSetCompactModeAction, store } = this.props;
		const { compactMode = false } = store ? store.getState() : {};
		dispatchCreateSetCompactModeAction(!compactMode);
	}

	private renderLanguageSelector = (language: string, updateLanguage: any) => {
		const { classes } = this.props;
		// tslint:disable:jsx-no-lambda
		return (
			<>
				<Fab
					// prettier-ignore
					color={language === 'pl' ? 'secondary' : 'default' }
					variant="extended"
					className={classes.button}
					onClick={() => updateLanguage('pl')}
				>
					PL
				</Fab>
				<Fab
					// prettier-ignore
					color={language === 'en' ? 'secondary' : 'default' }
					variant="extended"
					className={classes.button}
					onClick={() => updateLanguage('en')}
				>
					EN
				</Fab>
			</>
		);
	}

	private bindToStore(): void {
		const { store } = this.props;

		if (!this.unsubscribe && !!store) {
			this.unsubscribe = store.subscribe(() => {
				if (!!store) {
					this.setState(store.getState());
				}
			});
			this.setState(store.getState());
		}
	}
}

export default hot(module)(withRouter(withStyles(styles)(diDecorator(MenuComponent))));
