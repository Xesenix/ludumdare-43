import * as React from 'react';

import { Theme } from '@material-ui/core';
import { ThemeOptions } from '@material-ui/core/styles/createMuiTheme';
import { Shape, ShapeOptions } from '@material-ui/core/styles/shape';

export interface IAppThemeOptions extends ThemeOptions {
	layout: {
		container: {
			width: string;
		};
	};

	shape?: ShapeOptions & {
		toolbarButtonBorderRadius?: string;
	};

	icons?: {
		config?: React.ComponentType;
		undo?: React.ComponentType;
		fullscreenOn?: React.ComponentType;
		fullscreenOff?: React.ComponentType;
		muteOn?: React.ComponentType;
		muteOff?: React.ComponentType;
	};
}

export interface IAppTheme extends Theme {
	layout: {
		container: {
			width: string;
		};
	};

	shape: Shape & {
		toolbarButtonBorderRadius: string;
	};

	icons: {
		config: React.ComponentType;
		undo: React.ComponentType;
		fullscreenOn: React.ComponentType;
		fullscreenOff: React.ComponentType;
		muteOn: React.ComponentType;
		muteOff: React.ComponentType;
	};
}

export interface IAppThemes {
	light: IAppTheme;
	dark: IAppTheme;
}

export type ThemesNames = keyof IAppThemes;

export interface IThemeState {
	theme: ThemesNames;
}

export type ThemesProviderType = () => Promise<IAppThemes>;
