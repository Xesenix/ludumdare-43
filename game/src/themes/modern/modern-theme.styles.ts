import { darken, lighten, linearGradient, rgba } from 'polished';
import { IAppTheme, IAppThemeOptions } from 'theme';

import UndoIcon from '@material-ui/icons/Close';

export default (createTheme: (options: IAppThemeOptions) => IAppTheme, type: 'light' | 'dark') => {
	const MuiDrawer = {
		paper: {
			minWidth: '320px',
		},
	};

	const colorDefault = {
		main: '#333333',
		dark: '#000000',
		contrastText: '#ffffff',
	};

	const baseTheme = createTheme({
		palette: {
			type,
			secondary: {
				main: '#a00000',
				contrastText: '#ffffff',
			},
			primary: {
				main: '#3045ee',
				contrastText: '#ffffff',
			},

		},
	});

	const toolbarGradient = (color) => linearGradient({
		colorStops: [
			`${darken(0.3, color)} 0%`,
			`${lighten(0.2, color)} 10%`,
			`${color} 15%`,
			`${color} 90%`,
			`${darken(0.3, color)} 100%`,
		],
	});

	const menuButton = (color) => ({
		...toolbarGradient(color.main),
		boxShadow: '0',
		color: '#ffffff',
		'&:hover': {
		// 	...toolbarGradient(color.dark),
			boxShadow: 'inset 2px 0px 5px rgba(0, 0, 0, 0.6), inset -2px 0px 2px rgba(0, 0, 0, 0.1)',
			'& span': {
				color: '#ffff00',
				textShadow: '0 0 2px #ffffff, 0 0 5px #000000',
			},
		},
	});

	const styles: IAppThemeOptions = {
		typography: {
			htmlFontSize: 16,
			useNextVariants: true,
		},
		icons: {
			undo: UndoIcon,
		},
		palette: baseTheme.palette,
		layout: {
			container: {
				width: '1200px',
			},
		},
		overrides: {
			MuiToolbar: {
				root: {
					...toolbarGradient(colorDefault.main),
				},
			},
			MuiDrawer,
			TopMenuButton: {
				root: {
					borderRadius: '0',
					...menuButton(colorDefault),
				},
				primary: {
					...menuButton(baseTheme.palette.primary),
				},
				secondary: {
					...menuButton(baseTheme.palette.secondary),
				},
				label: {
					// color: '#ffffff',
				},
			},
		},
		props: {
			// TopMenuButton: {
			// 	disableRipple: true,
			// },
			MuiToolbar: {
				variant: 'dense',
				disableGutters: true,
			},
			MuiDrawer: {
				anchor: 'left',
			},
		},
	};

	return createTheme(styles);
};
