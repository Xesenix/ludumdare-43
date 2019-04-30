import { PropTypes } from '@material-ui/core';
import { isEqual, pickBy } from 'lodash';
import * as React from 'react';
import { hot } from 'react-hot-loader';
import Loadable from 'react-loadable';
import { withRouter } from 'react-router';
import { RouteComponentProps } from 'react-router';
import { Link as RouterLink } from 'react-router-dom';
import { Store } from 'redux';

import { connectToInjector } from 'lib/di/context';
import { II18nTranslation } from 'lib/i18n';
import { LanguageType } from 'lib/interfaces';
import { IAppTheme, ThemesNames } from 'theme';

// elements
// import { ButtonBaseProps } from '@material-ui/core/ButtonBase';
import CircularProgress from '@material-ui/core/CircularProgress';

const Loader = () => <CircularProgress />;
const LanguageSelectorComponent = Loadable({ loading: Loader, loader: () => import(/* webpackChunkName: "ui" */ 'components/containers/language-selector/language-selector') });

export interface IMenuItemExternalProps {
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
export interface IMenuExternalProps {
	MenuItem: React.ComponentType<IMenuItemExternalProps>;
}

/** Internal component properties include properties injected via dependency injection. */
interface IMenuInternalProps {
	__: II18nTranslation;
	dispatchCreateSetCompactModeAction: (value: boolean) => void;
	dispatchCreateSetMutedAction: (value: boolean) => void;
	dispatchSetFullscreenAction: (value: boolean) => void;
	getTheme: () => IAppTheme;
	store?: Store<IMenuState>;
}

/** Internal component state. */
interface IMenuState {
	fullscreen: boolean;
	mute: boolean;
	compactMode: boolean;
	/** required for interface updates after changing application language */
	language: LanguageType;
	/** required for interface updates after loading language */
	languages: any;
	/** required for interface updates after changing application theme */
	theme: ThemesNames;
}

const diDecorator = connectToInjector<IMenuExternalProps & RouteComponentProps, IMenuInternalProps>({
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
	getTheme: {
		dependencies: ['theme:get-theme'],
	},
	store: {
		dependencies: ['data-store'],
	},
});

type IMenuProps = IMenuExternalProps & IMenuInternalProps & RouteComponentProps;

class MenuComponent extends React.Component<IMenuProps, IMenuState> {
	private unsubscribeDataStore?: any;

	constructor(props) {
		super(props);
		const {
			// prettier-ignore
			compactMode,
			fullscreen,
			language,
			languages,
			mute,
			theme,
		} = props.store.getState();
		this.state = {
			// prettier-ignore
			compactMode,
			fullscreen,
			language,
			languages,
			mute,
			theme,
		};
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

	public shouldComponentUpdate(nextProps: IMenuProps, nextState: IMenuState): boolean {
		return !isEqual(this.props, nextProps) || !isEqual(this.state, nextState);
	}

	public render(): any {
		const {
			// prettier-ignore
			__,
			getTheme,
			location,
			MenuItem,
		} = this.props;
		const {
			// prettier-ignore
			compactMode,
			fullscreen,
			mute,
		} = this.state;
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

	private renderConfigLink = (props: IMenuItemExternalProps) => <RouterLink to="/config" {...props}/>;

	private renderGameLink = (props: IMenuItemExternalProps) => <RouterLink to="/game" {...props}/>;

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

	/**
	 * Responsible for notifying component about state changes related to this component.
	 * If global state changes for keys defined in this component state it will transfer global state to components internal state.
	 */
	private bindToStore(): void {
		const { store } = this.props;

		if (!this.unsubscribeDataStore && !!store) {
			const keys = Object.keys(this.state);
			const filter = (state: IMenuState) => pickBy(state, (_, key) => keys.indexOf(key) >= 0) as IMenuState;
			this.unsubscribeDataStore = store.subscribe(() => {
				if (!!store) {
					this.setState(filter(store.getState()));
				}
			});
			this.setState(filter(store.getState()));
		}
	}
}

export default hot(module)(withRouter<IMenuExternalProps & RouteComponentProps>(diDecorator(MenuComponent)));
