import { withStyles, WithStyles } from '@material-ui/core';
import { Container } from 'inversify';
import * as React from 'react';
import { hot } from 'react-hot-loader';
import Loadable from 'react-loadable';
import { Store } from 'redux';

// elements
import Checkbox from '@material-ui/core/Checkbox';
import FormControl from '@material-ui/core/FormControl';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Grid from '@material-ui/core/Grid';
import InputLabel from '@material-ui/core/InputLabel';
import LinearProgress from '@material-ui/core/LinearProgress';
import MenuItem from '@material-ui/core/MenuItem';
import Select from '@material-ui/core/Select';
import Typography from '@material-ui/core/Typography';
import Slider from '@material-ui/lab/Slider';

// icons
import SoundOffIcon from '@material-ui/icons/FlashOff';
import SoundOnIcon from '@material-ui/icons/FlashOn';
import MusicOnIcon from '@material-ui/icons/MusicNote';
import MusicOffIcon from '@material-ui/icons/MusicOff';
import MuteOffIcon from '@material-ui/icons/VolumeOff';
import MuteOnIcon from '@material-ui/icons/VolumeUp';

import { connectToInjector } from 'lib/di';
import { II18nState, II18nTranslation } from 'lib/i18n';
import { defaultUIState, IUIActions, IUIState } from 'lib/ui';

import { styles } from './configuration-view.styles';

const Loader = () => <LinearProgress />;
const LanguageSelectorComponent = Loadable({ loading: Loader, loader: () => import(/* webpackChunkName: "ui" */ 'components/containers/language-selector/language-selector') });
const ThemeSelectorComponent = Loadable({ loading: Loader, loader: () => import(/* webpackChunkName: "ui" */ 'components/containers/theme-selector/theme-selector') });

/** Component public properties required to be provided by parent component. */
export interface IConfigurationViewProps {}

/** Internal component properties include properties injected via dependency injection. */
interface IConfigurationViewInternalProps {
	__: II18nTranslation;
	di?: Container;
	dispatchSetEffectsMutedAction: (event: any, checked: boolean) => void;
	dispatchSetEffectsVolumeAction: (event: any, value: number) => void;
	dispatchSetMusicMutedAction: (event: any, checked: boolean) => void;
	dispatchSetMusicVolumeAction: (event: any, value: number) => void;
	dispatchSetMutedAction: (event: any, checked: boolean) => void;
	dispatchSetThemeAction: (event: any) => void;
	dispatchSetVolumeAction: (event: any, value: number) => void;
	store?: Store<IUIState & II18nState>;
}

/** Internal component state. */
interface IConfigurationViewState {}

const diDecorator = connectToInjector<IConfigurationViewProps, IConfigurationViewInternalProps>({
	__: {
		dependencies: ['i18n:translate'],
	},
	store: {
		dependencies: ['data-store'],
	},
	dispatchSetEffectsMutedAction: {
		dependencies: ['ui:actions@setEffectsMuted'],
		value: (setEffectsMuted: (value: boolean) => void) => Promise.resolve((event: any, checked: boolean) => setEffectsMuted(checked)),
	},
	dispatchSetEffectsVolumeAction: {
		dependencies: ['ui:actions@setEffectsVolume'],
		value: (setEffectsVolume: (value: number) => void) => Promise.resolve((event: any, value: number) => setEffectsVolume(value)),
	},
	dispatchSetMusicMutedAction: {
		dependencies: ['ui:actions@setMusicMuted'],
		value: (setMusicMuted: (value: boolean) => void) => Promise.resolve((event: any, checked: boolean) => setMusicMuted(checked)),
	},
	dispatchSetMusicVolumeAction: {
		dependencies: ['ui:actions@setMusicVolume'],
		value: (setMusicVolume: (value: number) => void) => Promise.resolve((event: any, value: number) => setMusicVolume(value)),
	},
	dispatchSetMutedAction: {
		dependencies: ['ui:actions@setMuted'],
		value: (setMuted: (value: boolean) => void) => Promise.resolve((event: any, checked: boolean) => setMuted(checked)),
	},
	dispatchSetThemeAction: {
		dependencies: ['ui:actions@setTheme'],
		value: (setTheme: (value: string) => void) => Promise.resolve((event: any) => setTheme(event.target.value)),
	},
	dispatchSetVolumeAction: {
		dependencies: ['ui:actions@setVolume'],
		value: (setVolume: (value: number) => void) => Promise.resolve((event: any, value: number) => setVolume(value)),
	},
});

export class ConfigurationViewComponent extends React.Component<IConfigurationViewProps & IConfigurationViewInternalProps & WithStyles<typeof styles>, IConfigurationViewState> {
	constructor(props) {
		super(props);
		this.state = {};
	}

	public render(): any {
		const {
			// prettier-ignore
			classes,
			store = { getState: () => ({ ...defaultUIState, language: 'en' }) },
			dispatchSetEffectsMutedAction,
			dispatchSetEffectsVolumeAction,
			dispatchSetMusicMutedAction,
			dispatchSetMusicVolumeAction,
			dispatchSetMutedAction,
			dispatchSetVolumeAction,
			__,
		} = this.props;
		const {
			// prettier-ignore
			mute,
			musicMuted,
			effectsMuted,
			volume,
			musicVolume,
			effectsVolume,
		} = store.getState();

		return (
			<form className={classes.root}>
				<Typography variant="h5" component="h1" className={classes.section}>
					{__('Sound configuration')}
				</Typography>
				<Grid container spacing={0} alignItems="stretch" component="section" className={classes.section}>
					<Grid item xs={6} sm={4}>
						<FormControlLabel
							className={classes.margin}
							label={__('master mute')}
							control={<Checkbox checkedIcon={<MuteOffIcon />} icon={<MuteOnIcon />} checked={mute} onChange={dispatchSetMutedAction} />}
						/>
					</Grid>
					<Grid item xs={6} sm={4}>
						<FormControlLabel
							className={classes.margin}
							label={__('music mute')}
							control={<Checkbox checkedIcon={<MuteOffIcon />} icon={<MuteOnIcon />} checked={musicMuted} onChange={dispatchSetMusicMutedAction} />}
						/>
					</Grid>
					<Grid item xs={6} sm={4}>
						<FormControlLabel
							className={classes.margin}
							label={__('fx mute')}
							control={<Checkbox checkedIcon={<MuteOffIcon />} icon={<MuteOnIcon />} checked={effectsMuted} onChange={dispatchSetEffectsMutedAction} />}
						/>
					</Grid>
					<Grid item xs={12} container>
						<Grid item xs={12} md={3}>
							<FormControlLabel className={classes.margin} label={__('master volume')} control={<span className={classes.icon}>{mute ? <MuteOffIcon /> : <MuteOnIcon />}</span>} />
						</Grid>
						<Grid item xs={12} md={9} className={classes.scroll}>
							<Slider min={0} max={1} step={1 / 32} value={volume} onChange={dispatchSetVolumeAction} />
						</Grid>
					</Grid>
					<Grid item xs={12} container>
						<Grid item xs={12} md={3}>
							<FormControlLabel
								className={classes.margin}
								label={__('music volume')}
								control={<span className={classes.icon}>{mute || musicMuted ? <MusicOffIcon /> : <MusicOnIcon />}</span>}
							/>
						</Grid>
						<Grid item xs={12} md={9} className={classes.scroll}>
							<Slider min={0} max={1} step={1 / 32} value={musicVolume} onChange={dispatchSetMusicVolumeAction} />
						</Grid>
					</Grid>
					<Grid item xs={12} container>
						<Grid item xs={12} md={3}>
							<FormControlLabel
								className={classes.margin}
								label={__('sound volume')}
								control={<span className={classes.icon}>{mute || effectsMuted ? <SoundOffIcon /> : <SoundOnIcon />}</span>}
							/>
						</Grid>
						<Grid item xs={12} md={9} className={classes.scroll}>
							<Slider min={0} max={1} step={1 / 32} value={effectsVolume} onChange={dispatchSetEffectsVolumeAction} />
						</Grid>
					</Grid>
				</Grid>
				<Typography variant="h5" component="h1" className={classes.section}>
					{__('User interface configuration')}
				</Typography>
				<Grid item xs={12} container component="section" className={classes.section}>
					<FormControl className={classes.formControl}>
						<InputLabel>{__('language')}</InputLabel>
						<LanguageSelectorComponent view={this.renderLanguageSelector}/>
					</FormControl>
					<FormControl className={classes.formControl}>
						<InputLabel>{__('theme')}</InputLabel>
						<ThemeSelectorComponent view={this.renderThemeSelector}/>
					</FormControl>
				</Grid>
			</form>
		);
	}

	private renderLanguageSelector = (value: string, update: any) => {
		const { __ } = this.props;
		// tslint:disable:jsx-no-lambda
		return (
			<Select value={value} onChange={(event) => update(event.target.value)}>
				<MenuItem value={'en'}>{__('english')}</MenuItem>
				<MenuItem value={'pl'}>{__('polish')}</MenuItem>
			</Select>
		);
	}

	private renderThemeSelector = (value: string, update: any) => {
		const { __ } = this.props;
		// tslint:disable:jsx-no-lambda
		return (
			<Select value={value} onChange={(event) => update(event.target.value)}>
				<MenuItem value={'light'}>{__('light')}</MenuItem>
				<MenuItem value={'dark'}>{__('dark')}</MenuItem>
			</Select>
		);
	}
}

export default hot(module)(withStyles(styles)(diDecorator(ConfigurationViewComponent)));
