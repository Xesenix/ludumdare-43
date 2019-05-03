import { IAppTheme, IAppThemeOptions } from 'theme';

export default (createTheme: (options: IAppThemeOptions) => IAppTheme, type: 'light' | 'dark') => {
	const MuiDrawer = {
		paper: {
			minWidth: '320px',
		},
	};

	const styles: IAppThemeOptions = {
		typography: {
			htmlFontSize: 16,
			useNextVariants: true,
		},
		palette: {
			type,
			secondary: {
				light: '#ff00d0',
				main: '#d000a0',
				dark: '#a00080',
				contrastText: '#ffffff',
			},
			primary: {
				light: '#a040c3',
				main: '#8030a0',
				dark: '#602080',
				contrastText: '#ffffff',
			},
		},
		layout: {
			container: {
				width: '1200px',
			},
		},
		overrides: {
			MuiToolbar: {
			},
			MuiDrawer,
			TopMenuButton: {
				root: {
					borderRadius: '0',
				},
			},
		},
		props: {
			MuiToolbar: {
				variant: 'dense',
				disableGutters: true,
			},
			MuiDrawer: {
				anchor: 'right',
			},
		},
	};

	return createTheme(styles);
};
