import { interfaces } from 'inversify';

import { createAppTheme } from './create-theme';

export function ThemesProvider({ container }: interfaces.Context) {
	const console: Console = container.get<Console>('debug:console');
	console.debug('ThemesProvider');

	return () => Promise.resolve({
		light: createAppTheme({
			typography: {
				htmlFontSize: 16,
				h1: {
					fontWeight: 'bold',
				},
				useNextVariants: true,
			},
			palette: {
				type: 'light',
				secondary: {
					light: '#ffc000',
					main: '#e8a000',
					dark: '#d09000',
					contrastText: '#ffffff',
				},
				primary: {
					light: '#ff8000',
					main: '#c30000',
					dark: '#a00000',
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
			},
		}),
		dark: createAppTheme({
			typography: {
				htmlFontSize: 16,
				useNextVariants: true,
			},
			palette: {
				type: 'dark',
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
			shape: {
				toolbarButtonBorderRadius: '0px',
			},
			overrides: {
				MuiToolbar: {
					root: {
						padding: '0',

					},
				},
				MuiFab: {
					extended: {
						// 'border-radius': '0px',
					},
				},
			},
		}),
	});
}