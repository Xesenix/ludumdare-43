import { PropTypes } from '@material-ui/core';
import * as React from 'react';
import { hot } from 'react-hot-loader';
import Loadable from 'react-loadable';
import { withRouter } from 'react-router';
import { RouteComponentProps } from 'react-router';
import { Link as RouterLink } from 'react-router-dom';
import { Store } from 'redux';

import { connectToInjector } from 'lib/di/context';
import { II18nTranslation } from 'lib/i18n';
import { IAppTheme } from 'theme';
import { defaultUIState, IUIState } from 'ui';

// elements
// import { ButtonBaseProps } from '@material-ui/core/ButtonBase';
import CircularProgress from '@material-ui/core/CircularProgress';

const Loader = () => <CircularProgress />;
const LanguageSelectorComponent = Loadable({ loading: Loader, loader: () => import(/* webpackChunkName: "ui" */ 'components/containers/language-selector/language-selector') });

export interface IMenuItemProps {
	active?: boolean;
	activeColor?: PropTypes.Color;
	color?: PropTypes.Color;
	component?: React.ReactType;
	ActiveIcon?: React.ComponentType;
	Icon?: React.ComponentType;
	label: React.ReactNode;
	onClick?: () => void;
}

/** Component public properties required to be provided by parent component. */
export interface IMenuProps {
	MenuItem: React.ComponentType<IMenuItemProps>;
}

/** Internal component properties include properties injected via dependency injection. */
interface IMenuInternalProps {
	__: II18nTranslation;
	dispatchCreateSetMutedAction: (value: boolean) => void;
	dispatchSetFullscreenAction: (value: boolean) => void;
	dispatchCreateSetCompactModeAction: (value: boolean) => void;
	store?: Store<IMenuState>;
	getTheme: () => IAppTheme;
}

/** Internal component state. */
interface IMenuState {
	fullscreen: boolean;
	mute: boolean;
	compactMode: boolean;
}

const diDecorator = connectToInjector<IMenuProps & RouteComponentProps, IMenuInternalProps>({
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
	getTheme: {
		dependencies: ['theme:get-theme'],
	},
});

class MenuComponent extends React.Component<IMenuProps & IMenuInternalProps & RouteComponentProps, IMenuState> {
	private unsubscribe?: any;

	constructor(props) {
		super(props);
		const { fullscreen, mute, compactMode } = props.store.getState();
		this.state = {
			fullscreen,
			mute,
			compactMode,
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
			this.unsubscribe = null;
		}
	}

	public render(): any {
		const {
			// prettier-ignore
			compactMode,
		} = this.state;
		const {
			// prettier-ignore
			__,
			location,
			MenuItem,
			store,
			getTheme,
		} = this.props;
		const {
			// prettier-ignore
			fullscreen = false,
			mute = false,
		} = store ? store.getState() : {};
		const theme = getTheme();
		// TODO: need menu component that renders diffrent buttons depending on context (toolbar, drawer) and is influenced by css theme
		return (
			<>
				{location.pathname !== '/config' ? (
					<MenuItem
						// prettier-ignore
						component={this.renderConfigLink}
						key="config"
						Icon={theme.icons.config}
						label={__('Configuration')}
					/>
				) : null}

				{location.pathname === '/config' ? (
					<MenuItem
						// prettier-ignore
						component={this.renderGameLink}
						key="game"
						Icon={theme.icons.undo}
						label={__('Back')}
					/>
				) : null}

				<MenuItem
					// prettier-ignore
					active={fullscreen}
					color="secondary"
					key="fullscreen"
					onClick={this.toggleFullScreen}
					ActiveIcon={theme.icons.fullscreenOn}
					Icon={theme.icons.fullscreenOff}
					label={__('Fullscreen')}
				/>

				<MenuItem
					// prettier-ignore
					active={mute}
					color="primary"
					onClick={this.toggleMute}
					ActiveIcon={theme.icons.muteOn}
					Icon={theme.icons.muteOff}
					label={__('Mute')}
				/>
				<MenuItem
					// prettier-ignore
					active={compactMode}
					color="default"
					activeColor="secondary"
					onClick={this.toggleCompactMode}
					label={__('Compact')}
				/>

				<LanguageSelectorComponent view={this.renderLanguageSelector} />
			</>
		);
	}

	private renderConfigLink = (props: IMenuItemProps) => <RouterLink to="/config" {...props}/>;

	private renderGameLink = (props: IMenuItemProps) => <RouterLink to="/game" {...props}/>;

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
		const {
			MenuItem,
		} = this.props;
		// tslint:disable:jsx-no-lambda
		return (
			<>
				<MenuItem
					// prettier-ignore
					active={language === 'pl'}
					color="default"
					activeColor="secondary"
					onClick={() => updateLanguage('pl')}
					label="PL"
				/>
				<MenuItem
					// prettier-ignore
					active={language === 'en'}
					color="default"
					activeColor="secondary"
					onClick={() => updateLanguage('en')}
					label="EN"
				/>
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

export default hot(module)(withRouter<IMenuProps & RouteComponentProps>(diDecorator(MenuComponent)));
