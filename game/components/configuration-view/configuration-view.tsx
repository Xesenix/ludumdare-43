import { withStyles, WithStyles } from '@material-ui/core';
import { Container } from 'inversify';
import { memoize } from 'lodash';
import * as React from 'react';
import { hot } from 'react-hot-loader';
import { Store } from 'redux';

// elements
import Checkbox from '@material-ui/core/Checkbox';
import FormControl from '@material-ui/core/FormControl';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Grid from '@material-ui/core/Grid';
import InputLabel from '@material-ui/core/InputLabel';
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

import LanguageSelectorComponent from '../language-selector/language-selector';

/** Component public properties required to be provided by parent component. */
export interface IConfigurationViewProps {
}

/** Internal component properties include properties injected via dependency injection. */
interface IConfigurationViewInternalProps {
	__: II18nTranslation;
	di?: Container;
	dispatchSetEffectsMutedAction: () => void;
	dispatchSetEffectsVolumeAction: () => void;
	dispatchSetMusicMutedAction: () => void;
	dispatchSetMusicVolumeAction: () => void;
	dispatchSetMutedAction: () => void;
	dispatchSetThemeAction: () => void;
	dispatchSetVolumeAction: () => void;
	store?: Store<IUIState & II18nState>;
}

const diDecorator = connectToInjector<IConfigurationViewProps, IConfigurationViewInternalProps>({
	__: {
		dependencies: ['i18n:translate'],
	},
	store: {
		dependencies: ['data-store'],
	},
	dispatchSetEffectsMutedAction: {
		dependencies: ['ui:actions'],
		value: (actions: IUIActions) => Promise.resolve((event, checked: boolean) => actions.setEffectsMuted(checked)),
	},
	dispatchSetEffectsVolumeAction: {
		dependencies: ['ui:actions'],
		value: (actions: IUIActions) => Promise.resolve((event, value) => actions.setEffectsVolume(value)),
	},
	dispatchSetMusicMutedAction: {
		dependencies: ['ui:actions'],
		value: (actions: IUIActions) => Promise.resolve((event, checked: boolean) => actions.setMusicMuted(checked)),
	},
	dispatchSetMusicVolumeAction: {
		dependencies: ['ui:actions'],
		value: (actions: IUIActions) => Promise.resolve((event, value) => actions.setMusicVolume(value)),
	},
	dispatchSetMutedAction: {
		dependencies: ['ui:actions'],
		value: (actions: IUIActions) => Promise.resolve((event, checked: boolean) => actions.setMuted(checked)),
	},
	dispatchSetThemeAction: {
		dependencies: ['ui:actions'],
		value: (actions: IUIActions) => Promise.resolve((event) => actions.setTheme(event.target.value)),
	},
	dispatchSetVolumeAction: {
		dependencies: ['ui:actions'],
		value: (actions: IUIActions) => Promise.resolve((event, value) => actions.setVolume(value)),
	},
});

/** Internal component state. */
interface IConfigurationState {}

export class ConfigurationViewComponent extends React.Component<IConfigurationViewProps & IConfigurationViewInternalProps & WithStyles<typeof styles>, IConfigurationState> {
	public render(): any {
		const {
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
			mute,
			musicMuted,
			effectsMuted,
			volume,
			musicVolume,
			effectsVolume,
		} = store.getState();

		return (
			<form className={classes.root}>
				<Typography variant="headline" component="h1">
					{__('Sound configuration')}
				</Typography>
				<Grid container spacing={0} alignItems="stretch" component="section">
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
				<Typography variant="headline" component="h1">
					{__('User interface configuration')}
				</Typography>
				<Grid item xs={12} container component="section">
					<FormControl className={classes.formControl}>
						<InputLabel>{__('language')}</InputLabel>
						<LanguageSelectorComponent view={this.renderLanguageSelector}/>
					</FormControl>
				</Grid>
			</form>
		);
	}

	private renderLanguageSelector = (language: string, updateLanguage: any) => {
		const { __ } = this.props;
		// tslint:disable:jsx-no-lambda
		return (
			<Select value={language} onChange={(event) => updateLanguage(event.target.value)}>
				<MenuItem value={'en'}>{__('english')}</MenuItem>
				<MenuItem value={'pl'}>{__('polish')}</MenuItem>
			</Select>
		);
	}
}

export default hot(module)(withStyles(styles)(diDecorator(ConfigurationViewComponent)));
