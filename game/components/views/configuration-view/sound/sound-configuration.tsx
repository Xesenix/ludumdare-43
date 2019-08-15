import { withStyles, WithStyles } from '@material-ui/core';
import { Container } from 'inversify';
import * as React from 'react';
import { hot } from 'react-hot-loader';

import { connectToInjector } from 'lib/di';
import { II18nLanguagesState, II18nTranslation } from 'lib/i18n';
import { LanguageType } from 'lib/interfaces';
import { IAppTheme } from 'theme';

// elements
import Checkbox from '@material-ui/core/Checkbox';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Grid from '@material-ui/core/Grid';

import EffectsVolumeComponent from './slider/effects-volume';
import MasterVolumeComponent from './slider/master-volume';
import MusicVolumeSliderComponent from './slider/music-volume';

import { styles } from '../configuration-view.styles';

/** Component public properties required to be provided by parent component. */
export interface ISoundConfigurationExternalProps {}

/** Internal component properties include properties injected via dependency injection. */
interface ISoundConfigurationInternalProps {
	__: II18nTranslation;
	di?: Container;
	dispatchSetEffectsMutedAction: (event: any, checked: boolean) => void;
	dispatchSetMusicMutedAction: (event: any, checked: boolean) => void;
	dispatchSetMutedAction: (event: any, checked: boolean) => void;
	getTheme: () => IAppTheme;
	bindToStore: (keys: (keyof ISoundConfigurationState)[]) => ISoundConfigurationState;
}

/** Internal component state. */
interface ISoundConfigurationState {
	effectsMuted: boolean;
	/** required for interface updates after changing application language */
	language: LanguageType;
	/** required for interface updates after loading language */
	languages: II18nLanguagesState;
	musicMuted: boolean;
	mute: boolean;
}

type ISoundConfigurationProps = ISoundConfigurationExternalProps & ISoundConfigurationInternalProps & WithStyles<typeof styles>;

const diDecorator = connectToInjector<ISoundConfigurationExternalProps, ISoundConfigurationInternalProps>({
	__: {
		dependencies: ['i18n:translate'],
	},
	dispatchSetEffectsMutedAction: {
		dependencies: ['ui:actions@setEffectsMuted'],
		value: (setEffectsMuted: (value: boolean) => void) => Promise.resolve((event: any, checked: boolean) => setEffectsMuted(checked)),
	},
	dispatchSetMusicMutedAction: {
		dependencies: ['ui:actions@setMusicMuted'],
		value: (setMusicMuted: (value: boolean) => void) => Promise.resolve((event: any, checked: boolean) => setMusicMuted(checked)),
	},
	dispatchSetMutedAction: {
		dependencies: ['ui:actions@setMuted'],
		value: (setMuted: (value: boolean) => void) => Promise.resolve((event: any, checked: boolean) => setMuted(checked)),
	},
	getTheme: {
		dependencies: ['theme:get-theme()'],
	},
	bindToStore: {
		dependencies: ['data-store:bind'],
	},
});

export function SoundConfigurationComponent(props: ISoundConfigurationProps) {
	const {
		// prettier-ignore
		__,
		classes,
		dispatchSetEffectsMutedAction,
		dispatchSetMusicMutedAction,
		dispatchSetMutedAction,
		getTheme,
		bindToStore,
	} = props;
	const {
		// prettier-ignore
		effectsMuted,
		musicMuted,
		mute,
	} = bindToStore([
		// prettier-ignore
		'effectsMuted',
		'language',
		'languages',
		'musicMuted',
		'mute',
	]);
	const theme = getTheme();
	const MuteOffIcon = theme.icons.muteOff;
	const muteOffIcon = <MuteOffIcon />;
	const MuteOnIcon = theme.icons.muteOn;
	const muteOnIcon = <MuteOnIcon />;
	const MusicOffIcon = theme.icons.musicOff;
	const musicOffIcon = <MusicOffIcon />;
	const MusicOnIcon = theme.icons.musicOn;
	const musicOnIcon = <MusicOnIcon />;
	const SoundOffIcon = theme.icons.soundOff;
	const soundOffIcon = <SoundOffIcon />;
	const SoundOnIcon = theme.icons.soundOn;
	const soundOnIcon = <SoundOnIcon />;

	return (
		<>
			<Grid container spacing={0} alignItems="stretch" component="section" className={classes.section}>
				<Grid item xs={12} sm={4}>
					<FormControlLabel
						className={classes.margin}
						label={__('master mute')}
						control={<Checkbox checkedIcon={muteOnIcon} icon={muteOffIcon} checked={mute} onChange={dispatchSetMutedAction} />}
					/>
				</Grid>
				<Grid item xs={12} sm={4}>
					<FormControlLabel
						className={classes.margin}
						label={__('music mute')}
						control={<Checkbox checkedIcon={musicOffIcon} icon={musicOnIcon} checked={musicMuted} onChange={dispatchSetMusicMutedAction} />}
					/>
				</Grid>
				<Grid item xs={12} sm={4}>
					<FormControlLabel
						className={classes.margin}
						label={__('fx mute')}
						control={<Checkbox checkedIcon={soundOffIcon} icon={soundOnIcon} checked={effectsMuted} onChange={dispatchSetEffectsMutedAction} />}
					/>
				</Grid>
				<Grid item xs={12} container>
					<Grid item xs={12} md={3}>
						<FormControlLabel
							className={classes.margin}
							label={__('master volume')}
							control={<span className={classes.icon}>{mute ? muteOnIcon : muteOffIcon}</span>}
						/>
					</Grid>
					<Grid item xs={12} md={9} className={classes.slider}>
						<MasterVolumeComponent />
					</Grid>
				</Grid>
				<Grid item xs={12} container>
					<Grid item xs={12} md={3}>
						<FormControlLabel
							className={classes.margin}
							label={__('music volume')}
							control={<span className={classes.icon}>{mute || musicMuted ? musicOffIcon : musicOnIcon}</span>}
						/>
					</Grid>
					<Grid item xs={12} md={9} className={classes.slider}>
						<MusicVolumeSliderComponent />
					</Grid>
				</Grid>
				<Grid item xs={12} container>
					<Grid item xs={12} md={3}>
						<FormControlLabel
							className={classes.margin}
							label={__('sound volume')}
							control={<span className={classes.icon}>{mute || effectsMuted ? soundOffIcon : soundOnIcon}</span>}
						/>
					</Grid>
					<Grid item xs={12} md={9} className={classes.slider}>
						<EffectsVolumeComponent />
					</Grid>
				</Grid>
			</Grid>
		</>
	);
}

export default hot(module)(withStyles(styles)(diDecorator(SoundConfigurationComponent))) as React.FunctionComponent<ISoundConfigurationExternalProps>;
