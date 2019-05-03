import { createMuiTheme } from '@material-ui/core/styles';
import { ThemeOptions } from '@material-ui/core/styles/createMuiTheme';
import { merge } from 'lodash';

// icon
import ConfigIcon from '@material-ui/icons/Build';
import FullScreenIcon from '@material-ui/icons/Fullscreen';
import FullScreenExitIcon from '@material-ui/icons/FullscreenExit';
import BackIcon from '@material-ui/icons/Undo';
import MuteOnIcon from '@material-ui/icons/VolumeOff';
import MuteOffIcon from '@material-ui/icons/VolumeUp';

import { IAppTheme, IAppThemeOptions } from './theme.interfaces';

export const createAppTheme = (theme: IAppThemeOptions): IAppTheme => {
	let baseTheme = createMuiTheme(theme as ThemeOptions);
	baseTheme = merge(baseTheme, {
		icons: {
			config: ConfigIcon,
			undo: BackIcon,
			fullscreenOn: FullScreenIcon,
			fullscreenOff: FullScreenExitIcon,
			muteOn: MuteOnIcon,
			muteOff: MuteOffIcon,
		},
		layout: {
			container: {
			},
		},
		overrides: {
			DrawerMenuButton: {
				root: {
					borderRadius: '0',

					minHeight: '0',
					padding: '0 24px 0 64px',
					'& span': {
						display: 'flex',
						justifyContent: 'stretch',
					},
					'& svg': {
						position: 'absolute',
						left: '16px',
						fontSize: 'xx-large',
					},
				},
			},
			TopMenuButton: {
				root: {
					'& svg': {
						fontSize: 'x-large',
					},
				},
			},
		},
	});

	return merge(baseTheme, theme) as IAppTheme;
};
