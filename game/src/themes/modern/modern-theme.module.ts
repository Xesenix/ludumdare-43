import { II18nTranslation } from 'lib/i18n';
import { IApplication } from 'lib/interfaces';
import { IAppTheme, IThemeBuilder, ThemeModule } from 'theme';

export class ModernThemeModule {
	public static register(app: IApplication) {
		ThemeModule.registerTheme(
			app,
			'modern-theme-light',
			(__: II18nTranslation) => __('modern-theme-light'),
			(createTheme: IThemeBuilder) => () =>
				import(/* webpackChunkName: "modern-theme" */ './modern-theme.styles')
					.then((module) => module.default(createTheme, 'light') as IAppTheme),
		);
		ThemeModule.registerTheme(
			app,
			'modern-theme-dark',
			(__: II18nTranslation) => __('modern-theme-dark'),
			(createTheme: IThemeBuilder) => () =>
				import(/* webpackChunkName: "modern-theme" */ './modern-theme.styles')
					.then((module) => module.default(createTheme, 'dark') as IAppTheme),
		);
	}
}
