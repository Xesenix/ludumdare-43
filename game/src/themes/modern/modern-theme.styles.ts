import { PaletteOptions } from '@material-ui/core/styles/createPalette';
import { darken, invert, lighten, linearGradient, radialGradient, rgba } from 'polished';
import { IAppTheme, IAppThemeOptions } from 'theme';

// icons
import UndoIcon from '@material-ui/icons/Close';
import SoundOnIcon from '@material-ui/icons/Grade';
import ConfigIcon from '@material-ui/icons/Settings';

export default (
	createTheme: (options: IAppThemeOptions) => IAppTheme,
	paletteConfig: PaletteOptions = {},
) => {
	const colorDefault = {
		light: '#aaaaaa',
		main: '#333333',
		dark: '#000000',
		contrastText: '#ffffff',
	};

	const { palette } = createTheme({
		palette: {
			secondary: {
				main: '#a00000',
				contrastText: '#ffffff',
			},
			primary: {
				main: '#3045ee',
				contrastText: '#ffffff',
			},
			...paletteConfig,
		},
	});

	const gridBackgroundImagePattern = (color, bgColor, size = '4px 4px') => ({
		backgroundImage: [
			linearGradient({
				colorStops: [
					`${color} 25%`,
					`transparent 25%`,
					`transparent 75%`,
					`${color} 75%`,
				],
				toDirection: '90deg',
			}).backgroundImage,
			linearGradient({
				colorStops: [
					`${color} 25%`,
					`transparent 25%`,
					`transparent 75%`,
					`${color} 75%`,
				],
				toDirection: '0',
			}).backgroundImage,
			radialGradient({
				colorStops: [
					`${rgba(bgColor, 0.8)} 0%`,
					`${rgba(bgColor, 0.6)} 40%`,
					`${rgba(bgColor, 0.1)} 80%`,
					'transparent 100%',
				],
				extent: 'ellipse at 50% 5%',
			}).backgroundImage,
		].join(', '),
		backgroundSize: [
			size,
			size,
			'200% 100%',
		],
	});

	const darkBgPattern = gridBackgroundImagePattern(
		rgba(lighten(0.3, colorDefault.main), 0.15),
		colorDefault.main,
	);
	const paperPattern = gridBackgroundImagePattern(
		rgba(lighten(0.3, colorDefault.light), 0.15),
		palette.type === 'light' ? lighten(0.3, palette.background.paper) : darken(0.3, palette.background.paper),
	);

	const toolbarGradient = (color, embose = true) => {
		const bgGradient = embose ? linearGradient({
			colorStops: [
				`${darken(0.3, color)} 0%`,
				`${lighten(0.2, color)} 10%`,
				`${color} 15%`,
				`${color} 90%`,
				`${darken(0.3, color)} 100%`,
			],
		}) : linearGradient({
			colorStops: [
				`${darken(0.3, color)} 0%`,
				`${color} 10%`,
				`${color} 95%`,
				`${darken(0.3, color)} 100%`,
			],
		});
		const pattern = gridBackgroundImagePattern(rgba(lighten(0.3, color), 0.25), color);

		return {
			...bgGradient,
			backgroundImage: [
				pattern.backgroundImage,
				bgGradient.backgroundImage,
			],
			backgroundSize: [
				...pattern.backgroundSize,
				'100% 100%',
			],
		};
	};

	const menuButton = (color) => ({
		...toolbarGradient(color.main),
		boxShadow: '0',
		color: color.contrastText,
		'&:hover': {
			...toolbarGradient(color.main, false),
			boxShadow: 'inset 2px 0px 5px rgba(0, 0, 0, 0.6), inset -2px 0px 2px rgba(0, 0, 0, 0.1)',
			'& span, & svg': {
				textShadow: `0 0 2px #ffffff, 0 0 5px ${invert(color.contrastText)}`,
			},
		},
	});

	const styles: IAppThemeOptions = {
		typography: {
			htmlFontSize: 16,
			useNextVariants: true,
		},
		icons: {
			config: ConfigIcon,
			undo: UndoIcon,
			soundOn: SoundOnIcon,
		},
		palette,
		layout: {
			primary: {
				root: {
					...paperPattern,
				},
			},
			container: {
				wrapper: {
					maxWidth: '1200px',
					background: palette.background.paper,
					boxShadow: palette.type === 'dark' ? 'inset 2px 2px 4px #000' : 'none',
				},
			},
		},
		overrides: {
			MuiToolbar: {
				root: {
					...toolbarGradient(colorDefault.main),
				},
			},
			MuiDrawer: {
				paper: {
					minWidth: '320px',
					...darkBgPattern,
				},
			},
			TopMenuButton: {
				root: {
					borderRadius: '0',
					...menuButton(colorDefault),
				},
				primary: {
					...menuButton(palette.primary),
				},
				secondary: {
					...menuButton(palette.secondary),
				},
				label: {
					// color: '#ffffff',
				},
			},
			MuiPaper: {
				root: {
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
