import * as React from 'react';

import { Theme } from '@material-ui/core';
import { FabClassKey } from '@material-ui/core/Fab';
import { StyleRules } from '@material-ui/core/styles';
import { ThemeOptions } from '@material-ui/core/styles/createMuiTheme';
import { Overrides } from '@material-ui/core/styles/overrides';

export interface ICSSProperties {
	[propertyName: string]: any;
}

export interface IAppThemeOptions extends ThemeOptions {
	layout?: {
		container?: {
			width?: string;
		};
	};

	icons?: {
		config?: React.ComponentType;
		undo?: React.ComponentType;
		fullscreenOn?: React.ComponentType;
		fullscreenOff?: React.ComponentType;
		muteOn?: React.ComponentType;
		muteOff?: React.ComponentType;
	};

	overrides?: Overrides & {
		DrawerMenuButton?: Partial<StyleRules<FabClassKey>>;
		TopMenuButton?: Partial<StyleRules<FabClassKey>>;
		topToolbar?: ICSSProperties;
	};
}

export interface IAppTheme extends Theme {
	layout: {
		container: {
			width: string;
		};

	};

	icons: {
		config: React.ComponentType;
		undo: React.ComponentType;
		fullscreenOn: React.ComponentType;
		fullscreenOff: React.ComponentType;
		muteOn: React.ComponentType;
		muteOff: React.ComponentType;
	};

	overrides: Overrides & {
		DrawerMenuButton: Partial<StyleRules<FabClassKey>>;
		TopMenuButton: Partial<StyleRules<FabClassKey>>;
		topToolbar: ICSSProperties;
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
